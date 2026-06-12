import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { hashPassword } from "@/lib/auth-helpers";
import { logAuditAction } from "@/lib/audit-logger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromRequest();
    
    // 1. Authorization check
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const { password } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // 2. Fetch target user
    const targetUser = await prisma.users.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Hash and Update
    const hashedPassword = hashPassword(password);
    
    await prisma.users.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });

    // 4. Audit Log
    await logAuditAction({
      actorId: session.id,
      targetId: userId,
      actionType: "PASSWORD_RESET",
      entityType: "USER",
    });

    return NextResponse.json({ success: true, message: "Security credentials updated successfully" });
  } catch (error) {
    console.error("Error in administrative password reset:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
