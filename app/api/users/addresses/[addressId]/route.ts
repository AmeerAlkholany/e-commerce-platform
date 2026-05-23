import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

interface RouteParams {
  params: Promise<{ addressId: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const addressId = parseInt(resolvedParams.addressId, 10);
    const body = await request.json();
    const { userId, street, city, country } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required for ownership verification" },
        { status: 400 }
      );
    }

    const uid = parseInt(userId, 10);

    // Verify existence
    const existingAddress = await prisma.addresses.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingAddress.user_id !== uid) {
      return NextResponse.json(
        { error: "Unauthorized: You can only update your own addresses" },
        { status: 403 }
      );
    }

    const updatedAddress = await prisma.addresses.update({
      where: { id: addressId },
      data: {
        street: street !== undefined ? street : existingAddress.street,
        city: city !== undefined ? city : existingAddress.city,
        country: country !== undefined ? country : existingAddress.country,
      },
    });

    return NextResponse.json(serializeBigInt(updatedAddress));
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const addressId = parseInt(resolvedParams.addressId, 10);
    
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");

    if (!userIdStr) {
      return NextResponse.json(
        { error: "userId is required for verification" },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdStr, 10);

    const existingAddress = await prisma.addresses.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    if (existingAddress.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own addresses" },
        { status: 403 }
      );
    }

    await prisma.addresses.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
