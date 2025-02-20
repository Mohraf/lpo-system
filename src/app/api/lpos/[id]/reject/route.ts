import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session || !(session.user.role === "APPROVER" || session.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lpoId = parseInt(req.nextUrl.pathname.split('/')[3]);

    if (isNaN(lpoId)) {
      return NextResponse.json({ error: "Invalid LPO ID" }, { status: 400 });
    }

    // Get the current LPO
    const lpo = await prisma.lpo.findUnique({
      where: { id: lpoId },
    });

    if (!lpo) {
      return NextResponse.json({ error: "LPO not found" }, { status: 404 });
    }

    const updateData: { rejected: string } = { rejected: "" };

    // if (session.user.role === "ADMIN") {
    //   // Admin should approve all missing levels at once
    //   updateData.firstApproverId = lpo.firstApproverId || parseInt(session.user.id);
    //   updateData.secondApproverId = lpo.secondApproverId || parseInt(session.user.id);
    //   updateData.finalApproverId = lpo.finalApproverId || parseInt(session.user.id);
    // } else {
    //   // Assign approver dynamically based on who hasn't approved yet
    //   if (!lpo.firstApproverId) {
    //     updateData.firstApproverId = parseInt(session.user.id);
    //   } else if (!lpo.secondApproverId) {
    //     updateData.secondApproverId = parseInt(session.user.id);
    //   } else if (!lpo.finalApproverId) {
    //     updateData.finalApproverId = parseInt(session.user.id);
    //   } else {
    //     return NextResponse.json({ error: "LPO already fully approved" }, { status: 400 });
    //   }
    // }

    updateData.rejected = "YES"
    

    // Update LPO record
    const updatedLpo = await prisma.lpo.update({
      where: { id: lpoId },
      data: {
        rejected: {
          set: "YES"
        }
      },
    });

    return NextResponse.json({ message: "LPO rejection successfull", lpo: updatedLpo });

  } catch (error: unknown) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Operation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
