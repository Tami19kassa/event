import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getPaymentSettings } from "@/lib/payment-verification";
import { generateOrderNumber, resolvePaymentVerification } from "@/lib/checkout-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      items,
      customerEmail,
      customerName,
      customerPhone,
      paymentMethod = "TELEBIRR",
      receiptUrl = "",
    } = body;

    if (!eventId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Event ID and at least one ticket item are required" },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid customer email is required" },
        { status: 400 }
      );
    }

    const settings = await getPaymentSettings();
    if (paymentMethod === "PAY_AT_GATE" && !settings.allowPayAtGate) {
      return NextResponse.json(
        { error: "Pay at Gate is not enabled for this platform." },
        { status: 400 }
      );
    }

    // 1. Fetch event and validate requested tickets BEFORE opening transaction
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTiers: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let totalAmount = 0;
    let totalTicketsCount = 0;
    const orderItemsToCreate: Array<{
      ticketTierId: string;
      ticketName: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of items) {
      if (!item.ticketTierId || !item.quantity || item.quantity <= 0) continue;
      const tier = event.ticketTiers.find((t) => t.id === item.ticketTierId);
      if (!tier) {
        return NextResponse.json(
          { error: `Ticket tier "${item.ticketTierId}" does not exist` },
          { status: 400 }
        );
      }
      if (tier.remaining < item.quantity) {
        return NextResponse.json(
          { error: `Only ${tier.remaining} ticket(s) remaining for "${tier.name}".` },
          { status: 400 }
        );
      }

      const lineTotal = Number(tier.price) * Number(item.quantity);
      totalAmount += lineTotal;
      totalTicketsCount += Number(item.quantity);
      orderItemsToCreate.push({
        ticketTierId: tier.id,
        ticketName: tier.name,
        quantity: Number(item.quantity),
        unitPrice: Number(tier.price),
      });
    }

    if (orderItemsToCreate.length === 0) {
      return NextResponse.json({ error: "No tickets selected" }, { status: 400 });
    }

    // 2. Perform receipt scraping / payment verification OUTSIDE transaction
    // This avoids holding open a Prisma interactive transaction during external HTTP fetch
    const paymentResult = await resolvePaymentVerification({
      paymentMethod: paymentMethod as any,
      totalAmount,
      receiptUrl,
    });

    const orderNumber = generateOrderNumber();

    // 3. Fast atomic database transaction with generous timeout for TiDB Cloud latency
    const createdOrder = await prisma.$transaction(
      async (tx) => {
        for (const item of orderItemsToCreate) {
          const tier = await tx.ticketTier.findUnique({
            where: { id: item.ticketTierId },
          });
          if (!tier || tier.remaining < item.quantity) {
            throw new Error(`Insufficient tickets remaining for "${item.ticketName}".`);
          }
          await tx.ticketTier.update({
            where: { id: item.ticketTierId },
            data: { remaining: { decrement: item.quantity } },
          });
        }

        const order = await tx.order.create({
          data: {
            orderNumber,
            eventId: event.id,
            customerEmail,
            customerName: customerName || null,
            customerPhone: customerPhone || null,
            totalAmount,
            currency: settings.currency || "ETB",
            status: paymentResult.status,
            paymentMethod,
            receiptUrl: receiptUrl || null,
            transactionRef: paymentResult.transactionRef || null,
            verifiedAt: paymentResult.status === "COMPLETED" ? new Date() : null,
            checkedIn: false,
            items: { create: orderItemsToCreate },
          },
          include: {
            items: true,
            event: {
              select: {
                title: true,
                slug: true,
                startDate: true,
                endDate: true,
                locationName: true,
                locationCity: true,
                format: true,
              },
            },
          },
        });

        await tx.event.update({
          where: { id: event.id },
          data: { attendeesCount: { increment: totalTicketsCount } },
        });

        return order;
      },
      { maxWait: 10000, timeout: 20000 }
    );

    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");

    return NextResponse.json({
      success: true,
      order: createdOrder,
      message: paymentResult.message,
    });
  } catch (error: any) {
    console.error("Checkout transaction error:", error);
    let message = error.message || "Failed to complete checkout";
    if (message.includes("Transaction API error") || message.includes("expired transaction")) {
      message = "The cloud transaction took longer than expected. Please try again or select Pay at Gate.";
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
