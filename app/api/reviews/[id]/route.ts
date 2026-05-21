import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
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

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    const review = await prisma.reviews.update({
      where: { id: reviewId },
      data: {
        rating: rating !== undefined ? rating : undefined,
        comment: comment !== undefined ? comment : undefined,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
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
