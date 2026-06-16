import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let whereClause: any = {
      user_id: user.id
    };

    if (status && status !== "all") {
      whereClause.status = status;
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
          order_items: {
            include: {
              products: true
            }
          }
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
    console.error("Client Orders API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
