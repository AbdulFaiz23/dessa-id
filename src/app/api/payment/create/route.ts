import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.id as string;
    const body = await request.json();
    const { plan } = body;

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = plan === "yearly" ? 449000 : 49000;
    const orderId = `dessa-${sellerId}-${Date.now()}`;

    // Create Order in DB
    await prisma.order.create({
      data: {
        orderId,
        sellerId,
        plan,
        amount,
        status: "pending",
        snapToken: "SIMULATION_MODE",
      },
    });

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    // === SIMULATION MODE (no Midtrans key) ===
    if (!serverKey) {
      return NextResponse.json({
        token: "SIMULATION_MODE",
        orderId,
        mode: "simulation",
      });
    }

    // === REAL MIDTRANS MODE ===
    const midtransClient = require("midtrans-client");
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_MODE === "production",
      serverKey,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    });

    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: amount },
      credit_card: { secure: true },
      customer_details: { first_name: "Penjual Dessa.id" },
    };

    const transaction = await snap.createTransaction(parameter);

    await prisma.order.update({
      where: { orderId },
      data: { snapToken: transaction.token },
    });

    return NextResponse.json({
      token: transaction.token,
      orderId,
      mode: "midtrans",
    });
  } catch (error: any) {
    console.error("Payment create error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

