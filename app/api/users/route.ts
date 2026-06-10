import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");
    const countOnly = searchParams.get("countOnly") === "true";

    if (countOnly) {
      const count = await prisma.users.count();
      return NextResponse.json({ count });
    }

    if (!userIdStr) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const userId = parseInt(userIdStr, 10);

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        verification_status: true,
        phone: true,
        avatar_url: true,
        last_login: true,
        created_at: true,
        addresses: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, phone, avatar_url } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const uid = parseInt(userId, 10);

    const existingUser = await prisma.users.findUnique({
      where: { id: uid }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.users.update({
      where: { id: uid },
      data: {
        name: name !== undefined ? name : existingUser.name,
        email: email !== undefined ? email : existingUser.email,
        phone: phone !== undefined ? phone : existingUser.phone,
        avatar_url: avatar_url !== undefined ? avatar_url : existingUser.avatar_url,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        verification_status: true,
        phone: true,
        avatar_url: true,
        last_login: true,
        created_at: true
      }
    });

    return NextResponse.json(serializeBigInt(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
