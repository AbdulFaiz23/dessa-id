import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { fullName, email, whatsapp, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        whatsapp,
        password: hashedPassword,
        role: "seller",
      },
    });

    await createSession({ id: user.id, email: user.email, role: user.role, name: user.fullName });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.fullName, role: user.role } });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
