import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  console.log("Signup request received");

  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { email, password, firstName, lastName, role } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      console.log("Validation failed: Missing fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure role is valid
    const validRoles = ["EMPLOYEE", "APPROVER", "ADMIN"];
    if (!validRoles.includes(role)) {
      console.log("Invalid role:", role);
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hash(password, 12);

    // Create user with selected role
    console.log("Creating user...");
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role, // ✅ Allow dynamic role selection
      },
    });

    console.log("User created:", user.id);
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
