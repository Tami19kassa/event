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

    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { ticketTiers: true },
      });

      if (!event) {
        throw new Error("Event not found");
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
          throw new Error(`Ticket tier "${item.ticketTierId}" does not exist`);
        }

        if (tier.remaining < item.quantity) {
          throw new Error(
            `Only ${tier.remaining} ticket(s) remaining for "${tier.name}". You requested ${item.quantity}.`
          );
        }

        await tx.ticketTier.update({
          where: { id: tier.id },
          data: { remaining: { decrement: item.quantity } },
        });

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
        throw new Error("No tickets selected");
      }

      const paymentResult = await resolvePaymentVerification({
        paymentMethod: paymentMethod as any,
        totalAmount,
        receiptUrl,
      });

      const orderNumber = generateOrderNumber();

      const createdOrder = await tx.order.create({
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
          items: {
            create: orderItemsToCreate,
          },
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
        data: {
          attendeesCount: { increment: totalTicketsCount },
        },
      });

      return {
        order: createdOrder,
        message: paymentResult.message,
      };
    });

    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");

    return NextResponse.json({
      success: true,
      order: result.order,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Checkout transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete checkout" },
      { status: 400 }
    );
  }
}
