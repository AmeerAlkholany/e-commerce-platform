import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-helpers";
import { createSession } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Fetch user from DB
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 401 }
      );
    }

    // 3. Verify password hash
    const isValidPassword = verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // 4. Create session (sets HTTP-only cookie)
    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 5. Respond with user details (omit password hash)
    const { password_hash, ...userResponse } = user;
    return NextResponse.json(serializeBigInt(userResponse), { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
