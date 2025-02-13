import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    try {
        const site = await prisma.site.create({
            data: {
                ...data,
            },
        });
        return NextResponse.json(site);
    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create Site" }, { status: 500 });
    }
}


export async function GET() {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const sites = await prisma.site.findMany();

        return NextResponse.json(sites);
    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch Companies" }, { status: 500 });
    }
}