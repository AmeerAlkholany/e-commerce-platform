import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";
import { createUserSchema } from "@/lib/validations/users";
import { logAuditAction } from "@/lib/audit-logger";
import { hashPassword } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const session = await getUserFromRequest();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortKey = searchParams.get("sortKey") || "created_at";
    const sortDir = (searchParams.get("sortDir") as "asc" | "desc") || "desc";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortKey]: sortDir },
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
        },
      }),
      prisma.users.count({ where }),
    ]);

    return NextResponse.json(serializeBigInt({
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }));
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getUserFromRequest();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { name, email, password, role, status, phone, avatar_url } = result.data;

    // Check if email exists
    const existing = await prisma.users.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // In a real app, you'd hash the password here.
    // For now, I'll use a placeholder or the same verify logic if I can find it.
    // Actually, I should use the same hashing as in signup.
    const hashedPassword = hashPassword(password);
    const user = await prisma.users.create({
      data: {
        name,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        role,
        status,
        phone,
        avatar_url,
      },
    });

    await logAuditAction({
      actorId: session.id,
      targetId: user.id,
      actionType: "USER_CREATE",
      entityType: "USER",
      newValues: user,
    });

    return NextResponse.json(serializeBigInt(user), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
