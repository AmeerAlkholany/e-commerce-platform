import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

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

    const orders = await prisma.orders.findMany({
      where: whereClause,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
              }
            }
          }
        },
        payments: true,
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(serializeBigInt(orders));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}