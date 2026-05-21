import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scryptSync } from "crypto";

// Helper to hash password
function hashPassword(password: string) {
  const salt = scryptSync(password, "salt", 64);
  return salt.toString("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: role || "customer",
      },
    });

    // Don't return the password hash
    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // In a real app, you'd check for admin role here
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
