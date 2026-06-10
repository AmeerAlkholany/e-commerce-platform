import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";
import { createAddressSchema } from "@/lib/validations/addresses";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");

    if (!userIdStr) {
      return NextResponse.json(
        { error: "userId is required to fetch addresses" },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid userId" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const addresses = await prisma.addresses.findMany({
      where: { user_id: userId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(serializeBigInt(addresses));
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createAddressSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { userId, street, city, country } = result.data;

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const address = await prisma.addresses.create({
      data: {
        user_id: userId,
        street,
        city,
        country,
      },
    });

    return NextResponse.json(serializeBigInt(address), { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

