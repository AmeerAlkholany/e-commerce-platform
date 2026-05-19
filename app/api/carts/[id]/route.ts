// app/api/cartss/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateCartSchema } from "./schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // 1. Await and extract the ID parameter
    const { id } = await params;
    const cartId = Number(id);

    // 2. Simple sanity check on the ID format
    if (isNaN(cartId)) {
      return NextResponse.json(
        { message: "Invalid ID format. Must be a number." },
        { status: 400 },
      );
    }

    // 3. Fetch from Prisma
    const cart = await prisma.carts.findUnique({
      where: { id: cartId },
    });

    // 4. Return 404 if record is missing
    if (!cart) {
      return NextResponse.json({ message: "cart not found" }, { status: 404 });
    }

    // 5. Success response
    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// HTTP PUT: Full Update / Replacement
export async function PUT(request: Request, { params }: RouteParams) {
  try {
  const { id } = await params;
  const body = await request.json();

  // Attach the ID from the URL parameter to the validation payload
  const validatedFields = UpdateCartSchema.safeParse({
    ...body,
    id: Number(id),
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const updatedCart = await prisma.carts.update({
    where: { id: Number(id) },
    data: validatedFields.data,
  });

  return NextResponse.json({ success: true, data: updatedCart });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

// HTTP DELETE: Resource Removal
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.carts.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error: any) {
    // If record doesn't exist
    if (error.code === "P2025") {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
