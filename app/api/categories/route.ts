import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get("countOnly") === "true";

    if (countOnly) {
      const count = await prisma.categories.count();
      return NextResponse.json({ count });
    }

    const [categories, total] = await Promise.all([
      prisma.categories.findMany({
        select: {
          id: true,
          name: true,
          parent_id: true,
          categories: { // This is the parent relation
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.categories.count()
    ]);

    return NextResponse.json(serializeBigInt({
      categories,
      pagination: {
        total,
        pages: 1,
        currentPage: 1
      }
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parent_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        name,
        parent_id: parent_id ? parseInt(parent_id.toString()) : null,
      },
    });

    return NextResponse.json(serializeBigInt(category), { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
