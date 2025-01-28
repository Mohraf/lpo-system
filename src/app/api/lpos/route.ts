import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  
  try {
    const lpo = await prisma.lpo.create({
      data: {
        ...data,
        createdById: parseInt(session.user.id),
      },
    });
    return NextResponse.json(lpo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create LPO" }, { status: 500 });
  }
}

// Add similar routes for GET, PUT, DELETE