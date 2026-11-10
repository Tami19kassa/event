import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getPaymentSettings } from "@/lib/payment-verification";
import {
  calculatePromoDiscount,
  generateOrderNumber,
  resolvePaymentVerification,
  validateCheckoutItems,
} from "@/lib/checkout-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many booking requests. Please try again in ${limit.retryAfterSeconds}s.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const {
      eventId,
      items,
      customerEmail,
      customerName,
      customerPhone,
      paymentMethod = "TELEBIRR",
      receiptUrl = "",
      promoCode = "",
    } = body;

    if (!eventId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Event ID and at least one ticket item are required" }, { status: 400 });
    }

    const normalizedEmail = typeof customerEmail === "string" ? customerEmail.trim().toLowerCase() : "";
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return NextResponse.json({ error: "A valid customer email is required" }, { status: 400 });
    }

    if (!["TELEBIRR", "CBE", "PAY_AT_GATE", "FREE"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
    }

    const settings = await getPaymentSettings();
    if (paymentMethod === "PAY_AT_GATE" && !settings.allowPayAtGate) {
      return NextResponse.json({ error: "Pay at Gate is not enabled for this platform." }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTiers: true },
    });

    if (!event || (event.status !== "PUBLISHED" && event.status !== "LIVE")) {
      return NextResponse.json({ error: "Event is not open for ticket booking" }, { status: 404 });
    }

    if (new Date(event.endDate).getTime() < Date.now() - 60 * 60 * 1000) {
      return NextResponse.json({ error: "Booking has closed because this event has ended." }, { status: 400 });
    }

    const openUnpaidCount = await prisma.order.count({
      where: {
        eventId: event.id,
        customerEmail: normalizedEmail,
        status: { in: ["PENDING_VERIFICATION", "RESERVED_PAY_AT_GATE"] },
      },
    });
    if (openUnpaidCount >= 3) {
      return NextResponse.json(
        { error: "You already have 3 pending reservations for this event. Complete or wait for verification first." },
        { status: 429 }
      );
    }

    const { subtotal, totalTicketsCount, orderItems } = validateCheckoutItems(items, event.ticketTiers);
    const { discountAmount } = calculatePromoDiscount(subtotal, promoCode);
    const totalAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

    const paymentResult = await resolvePaymentVerification({
      paymentMethod: paymentMethod as "TELEBIRR" | "CBE" | "PAY_AT_GATE" | "FREE",
      totalAmount,
      receiptUrl,
    });

    const orderNumber = generateOrderNumber();

    const createdOrder = await prisma.$transaction(
      async (tx) => {
        for (const item of orderItems) {
          const dec = await tx.ticketTier.updateMany({
            where: { id: item.ticketTierId, eventId: event.id, remaining: { gte: item.quantity } },
            data: { remaining: { decrement: item.quantity } },
          });
          if (dec.count === 0) {
            throw new Error(`Insufficient tickets remaining for "${item.ticketName}".`);
          }
        }

        const order = await tx.order.create({
          data: {
            orderNumber,
            eventId: event.id,
            customerEmail: normalizedEmail,
            customerName: typeof customerName === "string" ? customerName.trim().slice(0, 120) || null : null,
            customerPhone: typeof customerPhone === "string" ? customerPhone.trim().slice(0, 40) || null : null,
            totalAmount,
            currency: settings.currency || "ETB",
            status: paymentResult.status,
            paymentMethod,
            receiptUrl: receiptUrl ? String(receiptUrl).slice(0, 500) : null,
            transactionRef: paymentResult.transactionRef || null,
            verifiedAt: paymentResult.status === "COMPLETED" ? new Date() : null,
            checkedIn: false,
            items: { create: orderItems },
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
