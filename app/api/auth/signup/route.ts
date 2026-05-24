import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-helpers";
import { createSession } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // 3. Hash password and insert user into DB
    const hashedPassword = hashPassword(password);
    const user = await prisma.users.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        role: "customer", // Default role
      },
    });

    // 4. Create session (sets HTTP-only cookie)
    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 5. Respond with user details (omit password hash)
    const { password_hash, ...userResponse } = user;
    return NextResponse.json(serializeBigInt(userResponse), { status: 201 });
  } catch (error: any) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
