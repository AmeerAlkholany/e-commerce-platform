import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar_url: true,
        role: true,
        status: true,
        verification_status: true,
        created_at: true,
      }
    });

    return NextResponse.json(serializeBigInt(updatedUser));
  } catch (error) {
    console.error("Profile Update API Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile credentials" },
      { status: 500 }
    );
  }
}
