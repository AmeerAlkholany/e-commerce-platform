import { prisma } from "@/lib/prisma";

export type AuditAction = 
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_DELETE"
  | "USER_SUSPEND"
  | "USER_ACTIVATE"
  | "USER_BAN"
  | "USER_VERIFY"
  | "PASSWORD_RESET"
  | "EMAIL_SENT"
  | "ROLE_CHANGE"
  | "BULK_UPDATE"
  | "BULK_DELETE";

export type EntityType = "USER" | "ORDER" | "PRODUCT" | "CATEGORY";

interface LogActionParams {
  actorId: number;
  targetId?: number;
  actionType: AuditAction;
  entityType: EntityType;
  previousValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Logs an administrative action to the audit_logs table.
 */
export async function logAuditAction({
  actorId,
  targetId,
  actionType,
  entityType,
  previousValues,
  newValues,
  ipAddress,
  userAgent,
}: LogActionParams) {
  try {
    await prisma.audit_logs.create({
      data: {
        actor_id: actorId,
        target_id: targetId,
        action_type: actionType,
        entity_type: entityType,
        previous_values: previousValues || {},
        new_values: newValues || {},
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // We don't throw here to avoid breaking the main operation
  }
}
