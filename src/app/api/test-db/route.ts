import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({
      dbConnection: "success",
      userCount: users.length,
      users
    });
  } catch (error: unknown) {
    return NextResponse.json({
      dbConnection: "failed",
      error: (error as Error).message
    }, { status: 500 });
  }
}