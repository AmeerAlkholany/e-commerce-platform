import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

interface RouteParams {
  params: Promise<{ id: string, reviewId: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const reviewId = parseInt(resolvedParams.reviewId, 10);
    const body = await request.json();
    const { userId, rating, comment } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required for ownership verification" },
        { status: 400 }
      );
    }

    const uid = parseInt(userId, 10);

    // Verify existence
    const existingReview = await prisma.reviews.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingReview.user_id !== uid) {
      return NextResponse.json(
        { error: "Unauthorized: You can only update your own reviews" },
        { status: 403 }
      );
    }

    const data: any = {};
    if (rating !== undefined) {
      const ratingInt = parseInt(rating, 10);
      if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
        return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
      }
      data.rating = ratingInt;
    }
    if (comment !== undefined) data.comment = comment;

    const updatedReview = await prisma.reviews.update({
      where: { id: reviewId },
      data,
    });

    return NextResponse.json(serializeBigInt(updatedReview));
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const reviewId = parseInt(resolvedParams.reviewId, 10);
    
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");

    if (!userIdStr) {
      return NextResponse.json(
        { error: "userId is required for verification" },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdStr, 10);

    const existingReview = await prisma.reviews.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (existingReview.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own reviews" },
        { status: 403 }
      );
    }

    await prisma.reviews.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
