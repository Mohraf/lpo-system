import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    try {
        const company = await prisma.company.create({
            data: {
                ...data,
            },
        });
        return NextResponse.json(company);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create Company" }, { status: 500 });
    }
}


export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const companies = await prisma.company.findMany();

        return NextResponse.json(companies);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Companies" }, { status: 500 });
    }
}