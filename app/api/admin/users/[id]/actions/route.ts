import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { logAuditAction, AuditAction } from "@/lib/audit-logger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromRequest();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();
    const { action } = body;

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let updateData: any = {};
    let auditAction: AuditAction = "USER_UPDATE";

    switch (action) {
      case "suspend":
        updateData = { status: "suspended" };
        auditAction = "USER_SUSPEND";
        break;
      case "activate":
        updateData = { status: "active" };
        auditAction = "USER_ACTIVATE";
        break;
      case "ban":
        updateData = { status: "banned" };
        auditAction = "USER_BAN";
        break;
      case "verify":
        updateData = { verification_status: "verified" };
        auditAction = "USER_VERIFY";
        break;
      case "reset-password":
        // Mocking password reset
        auditAction = "PASSWORD_RESET";
        // Simulate email
        console.log(`[SIMULATION] Password reset email sent to ${user.email}`);
        return NextResponse.json({ message: "Password reset instructions sent" });
      case "send-email":
        // Mocking email send
        auditAction = "EMAIL_SENT";
        console.log(`[SIMULATION] Admin email sent to ${user.email}: ${body.subject}`);
        return NextResponse.json({ message: "Email sent successfully" });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
    });

    await logAuditAction({
      actorId: session.id,
      targetId: userId,
      actionType: auditAction,
      entityType: "USER",
      previousValues: user,
      newValues: updatedUser,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error performing user action:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
