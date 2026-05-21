import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, order_items } = body;

    if (!user_id || !order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return NextResponse.json(
        { error: "user_id and order_items (non-empty array) are required" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      let total = 0;
      const itemsToCreate = [];

      for (const item of order_items) {
        const product = await tx.products.findUnique({
          where: { id: item.product_id },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        const currentStock = product.stock ?? 0;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        itemsToCreate.push({
          product_id: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        // Update stock
        await tx.products.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const order = await tx.orders.create({
        data: {
          user_id: user_id,
          total: total,
          status: "pending",
          order_items: {
            create: itemsToCreate,
          },
        },
        include: {
          order_items: true,
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        order_items: true,
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
