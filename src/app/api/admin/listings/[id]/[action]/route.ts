import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string, action: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, action } = params;
    
    let status = "pending";
    let adminNote = null;
    let verified = false;

    if (action === "approve") {
      status = "published";
      verified = true;
    } else if (action === "reject") {
      status = "rejected";
      const data = await req.json();
      adminNote = data.adminNote;
    } else if (action === "sold") {
      status = "sold";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        status,
        ...(verified ? { verified } : {}),
        ...(adminNote ? { adminNote } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
