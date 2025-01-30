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
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Assuming you're fetching LPOs based on the logged-in user, adjust as needed
    const lpos = await prisma.lpo.findMany({
      where: { createdById: parseInt(session.user.id) }, // Fetching LPOs created by the logged-in user
      include: {
        site: true, // Include site data
        supplier: true, // Include supplier data
      },
    });

    return NextResponse.json(lpos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch LPOs" }, { status: 500 });
  }
}