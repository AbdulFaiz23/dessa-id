import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      include: { seller: { select: { fullName: true, whatsapp: true } } },
    });
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { getSession } = await import("@/lib/auth");
    const session = await getSession();
    if (!session || session.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // photos is an array sent from client — store as JSON string
    const photosArray: string[] = Array.isArray(data.photos) ? data.photos : (data.image ? [data.image] : []);
    const coverImage = photosArray[0] || null;

    const newListing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        area: data.area,
        price: data.price,
        docType: data.docType,
        certificateFile: data.certificateFile || null,
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.status || "pending",
        verified: false,
        sellerId: session.id as string,
        image: coverImage,
        photos: photosArray.length > 0 ? JSON.stringify(photosArray) : null,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    console.error("Listing create error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

