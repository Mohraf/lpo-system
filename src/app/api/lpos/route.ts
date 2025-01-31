import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// app/api/lpos/route.ts
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );

    const rawData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'siteId', 'supplierId', 'lpoNumber', 'prNumber',
      'paymentTerms', 'deliveryTerms', 'vatRate', 'supplyItems'
    ];
    
    const missingFields = requiredFields.filter(field => !rawData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate financial values
    const subTotal = rawData.supplyItems.reduce(
      (acc: number, item: any) => acc + (item.quantity * item.unitPrice),
      0
    );
    
    const total = subTotal * (1 + (rawData.vatRate / 100));

    const lpo = await prisma.lpo.create({
      data: {
        ...rawData,
        siteId: Number(rawData.siteId),
        supplierId: Number(rawData.supplierId),
        lpoNumber: rawData.lpoNumber,
        prNumber: rawData.prNumber,
        paymentTerms: rawData.paymentTerms,
        deliveryTerms: rawData.deliveryTerms,
        vatRate: Number(rawData.vatRate),
        subTotal,
        total,
        createdById: parseInt(session.user.id),
        supplyItems: {
          create: rawData.supplyItems.map((item: any) => ({
            name: item.name,
            quantity: Number(item.quantity),
            unit: item.unit,
            unitPrice: Number(item.unitPrice)
          }))
        }
      },
      include: { supplyItems: true }
    });

    return NextResponse.json(lpo);

  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json(
      { 
        error: "Operation failed",
        message: error.message,
        details: error.meta // Prisma error details
      },
      { status: 500 }
    );
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