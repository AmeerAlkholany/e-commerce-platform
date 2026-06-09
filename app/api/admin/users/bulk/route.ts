import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { bulkActionSchema } from "@/lib/validations/users";
import { logAuditAction } from "@/lib/audit-logger";

export async function POST(request: Request) {
  try {
    const session = await getUserFromRequest();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = bulkActionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { userIds, action, role } = result.data;

    if (userIds.includes(session.id)) {
      return NextResponse.json({ error: "Cannot perform bulk actions including yourself" }, { status: 400 });
    }

    let updateData: any = {};
    let auditType: any = "BULK_UPDATE";

    switch (action) {
      case "activate":
        updateData = { status: "active" };
        break;
      case "suspend":
        updateData = { status: "suspended" };
        break;
      case "verify":
        updateData = { verification_status: "verified" };
        break;
      case "set-role":
        if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 });
        updateData = { role };
        break;
      case "delete":
        await prisma.users.deleteMany({ where: { id: { in: userIds } } });
        await logAuditAction({
          actorId: session.id,
          actionType: "BULK_DELETE",
          entityType: "USER",
          newValues: { userIds },
        });
        return NextResponse.json({ success: true, count: userIds.length });
    }

    const updated = await prisma.users.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    });

    await logAuditAction({
      actorId: session.id,
      actionType: auditType,
      entityType: "USER",
      newValues: { userIds, action, updateData },
    });

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error) {
    console.error("Error performing bulk actions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
