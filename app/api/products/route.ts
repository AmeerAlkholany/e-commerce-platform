import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    let whereClause: any = {};

    if (categoryId) {
      whereClause.category_id = parseInt(categoryId);
    }

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive", // Works with postgres
      };
    }

    const products = await prisma.products.findMany({
      where: whereClause,
      include: {
        categories: true,
      },
    });

    return NextResponse.json(serializeBigInt(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category_id, image_url } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        stock: stock || 0,
        category_id: category_id ? parseInt(category_id) : null,
        image_url,
      },
    });

    return NextResponse.json(serializeBigInt(product), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
