import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";
import { updateUserSchema } from "@/lib/validations/users";
import { logAuditAction } from "@/lib/audit-logger";

export async function GET(
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
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        orders: { take: 20, orderBy: { created_at: "desc" } },
        reviews: { take: 10, orderBy: { created_at: "desc" } },
        addresses: true,
        audit_logs_target: {
          take: 50,
          orderBy: { timestamp: "desc" },
          include: { actor: { select: { name: true, email: true } } }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt(user));
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
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
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const previousValue = await prisma.users.findUnique({ where: { id: userId } });
    if (!previousValue) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: result.data,
    });

    await logAuditAction({
      actorId: session.id,
      targetId: userId,
      actionType: "USER_UPDATE",
      entityType: "USER",
      previousValues: previousValue,
      newValues: updatedUser,
    });

    return NextResponse.json(serializeBigInt(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
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
    
    // Check if deleting themselves
    if (userId === session.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    const user = await prisma.users.delete({ where: { id: userId } });

    await logAuditAction({
      actorId: session.id,
      targetId: userId,
      actionType: "USER_DELETE",
      entityType: "USER",
      previousValues: user,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
