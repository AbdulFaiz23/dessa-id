import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Increment viewCount safely using Prisma's atomic increment
    await prisma.listing.update({
      where: { id: params.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
