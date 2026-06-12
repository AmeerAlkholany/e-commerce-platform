import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";
import { updateAddressSchema } from "@/lib/validations/addresses";

interface RouteParams {
  params: Promise<{ addressId: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const addressId = parseInt(resolvedParams.addressId, 10);
    const body = await request.json();
    const result = updateAddressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

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

    const updatedAddress = await prisma.addresses.update({
      where: { id: addressId },
      data: result.data,
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
    
    const existingAddress = await prisma.addresses.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
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

