import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { verifyPassword, hashPassword } from "@/lib/auth-helpers";

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getUserFromRequest();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 });
    }

    // Get user with password hash
    const user = await prisma.users.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCorrect = verifyPassword(currentPassword, user.password_hash);
    if (!isCorrect) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Update password
    const newHash = hashPassword(newPassword);
    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password Update API Error:", error);
    return NextResponse.json({ error: "Failed to update security credentials" }, { status: 500 });
  }
}
