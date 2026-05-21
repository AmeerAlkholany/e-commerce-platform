import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");

    if (!userIdStr) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const userId = parseInt(userIdStr, 10);

    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: { products: true }
        },
        payments: true
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(serializeBigInt(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const uid = parseInt(userId, 10);

    // 1. Get user's cart
    const cart = await prisma.carts.findUnique({
      where: { user_id: uid },
      include: {
        cart_items: {
          include: { products: true }
        }
      }
    });

    if (!cart || cart.cart_items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Calculate total
    let total = 0;
    const orderItemsData = cart.cart_items.map(item => {
      const price = item.products?.price ? Number(item.products.price) : 0;
      total += price * item.quantity;
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: price
      };
    });

    // 3. Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.orders.create({
        data: {
          user_id: uid,
          total: total,
          status: 'pending',
          order_items: {
            create: orderItemsData
          }
        },
        include: {
          order_items: true
        }
      });

      // Clear the cart
      await tx.cart_items.deleteMany({
        where: { cart_id: cart.id }
      });

      return newOrder;
    });

    return NextResponse.json(serializeBigInt(order), { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
