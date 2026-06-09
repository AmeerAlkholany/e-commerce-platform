import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

export async function GET() {
  try {
    const session = await getUserFromRequest();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [total, active, suspended, unverified, newUsers] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { status: "active" } }),
      prisma.users.count({ where: { status: "suspended" } }),
      prisma.users.count({ where: { verification_status: "unverified" } }),
      prisma.users.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calculate growth (mocked for now, or could compare to previous 30d)
    const growth = 12.5; 

    return NextResponse.json({
      total,
      active,
      suspended,
      newUsers,
      verified: total - unverified,
      growth,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
