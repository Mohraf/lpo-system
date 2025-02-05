import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const lpoId = req.nextUrl.searchParams.get('lpoId');
        if (lpoId) {
            const supplyItems = await prisma.supplyItem.findMany({
                where: { lpoId: parseInt(lpoId) }, // Fetching SupplyItems by the selected LPO
            });
            return NextResponse.json(supplyItems);
        } else {
            return console.error("Please pass LpoID")
        }

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch LPOs" }, { status: 500 });
    }
}