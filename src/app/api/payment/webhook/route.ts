import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
const crypto = require('crypto');

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id
    } = payload;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key';
    const hash = crypto.createHash('sha512').update(order_id + status_code + gross_amount + serverKey).digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const order = await prisma.order.findUnique({ where: { orderId: order_id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === 'paid') {
      // Idempotency: skip if already paid
      return NextResponse.json({ status: "ok" });
    }

    let newStatus = order.status;
    if (transaction_status == 'capture' || transaction_status == 'settlement') {
        newStatus = 'paid';
    } else if (transaction_status == 'cancel' || transaction_status == 'deny') {
        newStatus = 'failed';
    } else if (transaction_status == 'expire') {
        newStatus = 'expired';
    } else if (transaction_status == 'pending') {
        newStatus = 'pending';
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        paymentMethod: payment_type,
        midtransTransactionId: transaction_id,
        webhookRaw: JSON.stringify(payload),
        paidAt: newStatus === 'paid' ? new Date() : null,
      }
    });

    if (newStatus === 'paid') {
      const isYearly = order.plan === 'yearly';
      const days = isYearly ? 365 : 30;
      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + days);

      // We should update existing active subscription if any, or create a new one.
      // For simplicity in MVP, we just create a new record and our status API picks the latest.
      await prisma.subscription.create({
        data: {
          sellerId: order.sellerId,
          plan: order.plan,
          status: 'active',
          expiredAt,
          maxListings: isYearly ? 15 : 5,
        }
      });
    }

    return NextResponse.json({ status: "ok" });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
