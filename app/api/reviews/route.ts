import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, product_id, rating, comment } = body;

    if (!user_id || !product_id || rating === undefined || comment === undefined) {
      return NextResponse.json(
        { error: "user_id, product_id, rating, and comment are required" },
        { status: 400 }
      );
    }

    const review = await prisma.reviews.create({
      data: {
        user_id,
        product_id,
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.reviews.findMany({
      include: {
        users: {
          select: {
            name: true,
          },
        },
        products: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
