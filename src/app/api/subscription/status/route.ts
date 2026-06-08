import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || !session.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sellerId = session.id as string;

  const subscription = await prisma.subscription.findFirst({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return NextResponse.json({
      status: "none",
      plan: null,
      expiredAt: null,
      remainingDays: 0,
      isWhitelisted: false,
    });
  }

  const now = new Date();
  const expiredAt = new Date(subscription.expiredAt);
  const remainingDays = Math.max(
    0,
    Math.ceil((expiredAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  let currentStatus = subscription.status;
  if (
    currentStatus === "active" &&
    remainingDays === 0 &&
    !subscription.isWhitelisted
  ) {
    currentStatus = "expired";
  }

  return NextResponse.json({
    status: currentStatus,
    plan: subscription.plan,
    expiredAt: subscription.expiredAt,
    remainingDays,
    isWhitelisted: subscription.isWhitelisted,
    maxListings: subscription.maxListings,
  });
}
