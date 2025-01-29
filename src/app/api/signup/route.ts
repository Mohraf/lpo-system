// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { hash } from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { email, password, firstName, lastName } = await req.json();

//     // Validate input
//     if (!email || !password || !firstName || !lastName) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email: email.toLowerCase() },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await hash(password, 12);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email: email.toLowerCase(),
//         password: hashedPassword,
//         firstName,
//         lastName,
//         role: "EMPLOYEE", // Default role
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: `${user.firstName} ${user.lastName}`,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  console.log('Signup request received');
  
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { email, password, firstName, lastName } = body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      console.log('Validation failed: Missing fields');
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hash(password, 12);

    // Create user
    console.log('Creating user...');
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: "EMPLOYEE",
      },
    });

    console.log('User created:', user.id);
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
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