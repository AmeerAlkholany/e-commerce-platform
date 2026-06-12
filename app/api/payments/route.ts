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

    // Pagination Params
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const [payments, total] = await Promise.all([
      prisma.payments.findMany({
        where: whereClause,
        select: {
          id: true,
          status: true,
          method: true,
          transaction_id: true,
          orders: {
            select: {
              id: true,
              total: true,
              created_at: true,
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
        skip,
        take: pageSize,
        orderBy: { id: 'desc' }
      }),
      prisma.payments.count({ where: whereClause })
    ]);

    return NextResponse.json(serializeBigInt({
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / pageSize),
        currentPage: page
      }
    }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
