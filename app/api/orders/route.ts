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
      const count = await prisma.orders.count();
      return NextResponse.json({ count });
    }

    let whereClause: any = {};

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        {
          users: {
            name: { contains: search, mode: "insensitive" }
          }
        },
        {
          users: {
            email: { contains: search, mode: "insensitive" }
          }
        }
      ];
    }

    // Pagination Params
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: whereClause,
        select: {
          id: true,
          total: true,
          status: true,
          created_at: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
        },
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' }
      }),
      prisma.orders.count({ where: whereClause })
    ]);

    return NextResponse.json(serializeBigInt({
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / pageSize),
        currentPage: page
      }
    }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}