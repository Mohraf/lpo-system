import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    try {
        const supplier = await prisma.supplier.create({
            data: {
                ...data,
            },
        });
        return NextResponse.json(supplier);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create Supplier" }, { status: 500 });
    }
}


export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const suppliers = await prisma.supplier.findMany();

        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Suppliers" }, { status: 500 });
    }
}