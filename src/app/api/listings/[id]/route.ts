import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { seller: { select: { fullName: true, email: true, whatsapp: true } } },
    });

    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (listing.sellerId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    // Handle photos array
    const photosArray: string[] = Array.isArray(data.photos) ? data.photos : [];
    const coverImage = photosArray[0] || data.image || listing.image || null;

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title: data.title ?? listing.title,
        description: data.description ?? listing.description,
        category: data.category ?? listing.category,
        area: data.area ?? listing.area,
        price: data.price ?? listing.price,
        docType: data.docType ?? listing.docType,
        certificateFile: data.certificateFile !== undefined ? data.certificateFile : listing.certificateFile,
        latitude: data.latitude ?? listing.latitude,
        longitude: data.longitude ?? listing.longitude,
        image: coverImage,
        photos: photosArray.length > 0 ? JSON.stringify(photosArray) : listing.photos,
        status: session.role === "admin" ? (data.status ?? listing.status) : "pending",
        verified: session.role === "admin" ? (data.verified ?? listing.verified) : false,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Listing update error:", error?.message || error);
    return NextResponse.json({ error: "Internal Server Error", detail: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (listing.sellerId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
