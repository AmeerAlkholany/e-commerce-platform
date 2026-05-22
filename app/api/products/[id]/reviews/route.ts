import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const reviews = await prisma.reviews.findMany({
      where: { product_id: productId },
      include: {
        users: {
          select: { id: true, name: true }
        }
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(serializeBigInt(reviews));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id, 10);
    const body = await request.json();
    const { userId, rating, comment } = body;
    
    if (!userId || rating === undefined) {
      return NextResponse.json(
        { error: "userId and rating are required" },
        { status: 400 }
      );
    }

    const uid = parseInt(userId, 10);
    const ratingInt = parseInt(rating, 10);

    if (isNaN(uid) || isNaN(ratingInt) || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid IDs or rating" },
        { status: 400 }
      );
    }

    if (ratingInt < 1 || ratingInt > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.users.findUnique({ where: { id: uid } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify product exists
    const product = await prisma.products.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Prevent duplicate reviews
    const existingReview = await prisma.reviews.findFirst({
      where: {
        user_id: uid,
        product_id: productId
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const review = await prisma.reviews.create({
      data: {
        user_id: uid,
        product_id: productId,
        rating: ratingInt,
        comment,
      },
    });

    return NextResponse.json(serializeBigInt(review), { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
