import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { fullName: true, email: true, whatsapp: true, createdAt: true },
        },
      },
    });
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
