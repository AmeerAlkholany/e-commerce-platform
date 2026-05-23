import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

// Helper to get cart for user (creates one if it doesn't exist)
async function getOrCreateCart(userId: number) {
  let cart = await prisma.carts.findUnique({
    where: { user_id: userId },
    include: {
      cart_items: {
        include: { products: true }
      }
    }
  });

  if (!cart) {
    cart = await prisma.carts.create({
      data: { user_id: userId },
      include: {
        cart_items: {
          include: { products: true }
        }
      }
    });
  }
  return cart;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");

    if (!userIdStr) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
    
    const cart = await getOrCreateCart(userId);

    return NextResponse.json(serializeBigInt(cart));
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: "userId and productId are required" }, { status: 400 });
    }

    const uid = parseInt(userId, 10);
    const pid = parseInt(productId, 10);
    
    if (isNaN(uid) || isNaN(pid)) {
      return NextResponse.json({ error: "Invalid userId or productId" }, { status: 400 });
    }

    const qty = quantity ? parseInt(quantity, 10) : 1;

    const cart = await getOrCreateCart(uid);

    // Check if item already exists in cart
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: pid
      }
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty }
      });
      return NextResponse.json(serializeBigInt(updatedItem), { status: 200 });
    } else {
      // Create new item
      const newItem = await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: pid,
          quantity: qty
        }
      });
      return NextResponse.json(serializeBigInt(newItem), { status: 201 });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "cartItemId and quantity are required" }, { status: 400 });
    }

    const itemId = parseInt(cartItemId, 10);
    const qty = parseInt(quantity, 10);

    if (isNaN(itemId) || isNaN(qty)) {
      return NextResponse.json({ error: "Invalid cartItemId or quantity" }, { status: 400 });
    }

    if (qty <= 0) {
       // Delete item if quantity is 0 or less
       await prisma.cart_items.delete({
         where: { id: itemId }
       });
       return NextResponse.json({ message: "Item removed from cart" });
    }

    const updatedItem = await prisma.cart_items.update({
      where: { id: itemId },
      data: { quantity: qty }
    });

    return NextResponse.json(serializeBigInt(updatedItem));
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemIdStr = searchParams.get("cartItemId");

    if (!cartItemIdStr) {
      return NextResponse.json({ error: "cartItemId is required" }, { status: 400 });
    }

    const itemId = parseInt(cartItemIdStr, 10);
    
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid cartItemId" }, { status: 400 });
    }

    await prisma.cart_items.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
