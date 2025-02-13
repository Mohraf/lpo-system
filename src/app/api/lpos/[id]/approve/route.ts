import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface ApproveData {
  firstApproverId: number;
  secondApproverId: number;
  finalApproverId: number;
}

// Define a type for the params
interface Params {
  id: string; // Expecting id to be a string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session || !(session.user.role === "APPROVER" || session.user.role === "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lpoId = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);

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

    const updateData: ApproveData = {
      firstApproverId: lpo.firstApproverId || parseInt(session.user.id),
      secondApproverId: lpo.secondApproverId || parseInt(session.user.id),
      finalApproverId: lpo.finalApproverId || parseInt(session.user.id),
    };

    if (session.user.role === "ADMIN") {
      // Admin should approve all missing levels at once
      updateData.firstApproverId = lpo.firstApproverId || parseInt(session.user.id);
      updateData.secondApproverId = lpo.secondApproverId || parseInt(session.user.id);
      updateData.finalApproverId = lpo.finalApproverId || parseInt(session.user.id);
    } else {
      // Assign approver dynamically based on who hasn't approved yet
      if (!lpo.firstApproverId) {
        updateData.firstApproverId = parseInt(session.user.id);
      } else if (!lpo.secondApproverId) {
        updateData.secondApproverId = parseInt(session.user.id);
      } else if (!lpo.finalApproverId) {
        updateData.finalApproverId = parseInt(session.user.id);
      } else {
        return NextResponse.json({ error: "LPO already fully approved" }, { status: 400 });
      }
    }
    

    // Update LPO record
    const updatedLpo = await prisma.lpo.update({
      where: { id: lpoId },
      data: updateData,
    });

    return NextResponse.json({ message: "LPO approved successfully", lpo: updatedLpo });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Operation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
