import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const countOnly = searchParams.get("countOnly") === "true";

    if (countOnly) {
      const count = await prisma.payments.count({
        // where: {
        //   status: "pending"
        // }
      });
      return NextResponse.json({ count });
    }

    let whereClause: any = {};

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        {
          transaction_id: { contains: search, mode: "insensitive" }
        },
        {
          orders: {
            users: {
              email: { contains: search, mode: "insensitive" }
            }
          }
        },
        {
          orders: {
            users: {
              name: { contains: search, mode: "insensitive" }
            }
          }
        }
      ];
    }

    const payments = await prisma.payments.findMany({
      where: whereClause,
      include: {
        orders: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(serializeBigInt(payments));
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
