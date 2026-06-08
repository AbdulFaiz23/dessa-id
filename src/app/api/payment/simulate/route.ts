import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Simulate payment confirmation for development without Midtrans
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Find the order
    const order = await prisma.order.findUnique({ where: { orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.sellerId !== (session.id as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ status: "already_paid" });
    }

    // Simulate successful payment
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        paymentMethod: "simulation",
        paidAt: new Date(),
        webhookRaw: JSON.stringify({ simulation: true, paid_at: new Date() }),
      },
    });

    // Activate subscription
    const isYearly = order.plan === "yearly";
    const days = isYearly ? 365 : 30;
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + days);

    await prisma.subscription.create({
      data: {
        sellerId: order.sellerId,
        plan: order.plan,
        status: "active",
        expiredAt,
        maxListings: isYearly ? 15 : 5,
      },
    });

    return NextResponse.json({ status: "paid", expiredAt });
  } catch (error: any) {
    console.error("Simulate payment error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
