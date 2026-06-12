import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination Params
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const skip = (page - 1) * pageSize;

    // Filter Params
    const categoryId = searchParams.get("categoryId");
    const categoryName = searchParams.get("categoryName");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "id_desc"; // Default

    const countOnly = searchParams.get("countOnly") === "true";

    let whereClause: any = {};

    if (categoryId) {
      whereClause.category_id = parseInt(categoryId);
    } else if (categoryName && categoryName !== "All") {
      whereClause.categories = {
        name: categoryName
      };
    }

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Price Filtering
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    // Handle count only request
    if (countOnly) {
      const count = await prisma.products.count({ where: whereClause });
      return NextResponse.json({ count });
    }

    // Sorting Logic
    let orderBy: any = {};
    if (sortBy === "price_asc") orderBy = { price: 'asc' };
    else if (sortBy === "price_desc") orderBy = { price: 'desc' };
    else if (sortBy === "alpha_asc") orderBy = { name: 'asc' };
    else if (sortBy === "alpha_desc") orderBy = { name: 'desc' };
    else orderBy = { id: 'desc' };

    // Fetch products and total count for pagination metadata
    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
        where: whereClause,
        include: {
          categories: true,
        },
        skip: skip,
        take: pageSize,
        orderBy: orderBy
      }),
      prisma.products.count({ where: whereClause })
    ]);

    return NextResponse.json(serializeBigInt({
      products,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / pageSize),
        currentPage: page,
        pageSize: pageSize
      }
    }));
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
