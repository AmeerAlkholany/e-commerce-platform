import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ─── Helper: Validate & sanitize inputs ──────────────
function sanitizeProductInput(body: Record<string, unknown>) {
  console.log("🔍 PUT body received:", JSON.stringify(body, null, 2));

  const errors: string[] = [];
  const data: Record<string, unknown> = {};

  // Name
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (name.length < 1) errors.push("Name is required");
    else if (name.length > 200) errors.push("Name too long (max 200 chars)");
    else data.name = name;
  }

  // Description
  if (body.description !== undefined) {
    const desc = body.description === null ? null : String(body.description).trim();
    data.description = desc;
  }

  // Price — CRITICAL FIX
  if (body.price !== undefined) {
    console.log("💰 Raw price value:", body.price, "type:", typeof body.price);
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push(`Invalid price: ${body.price} (parsed as ${price})`);
    } else {
      data.price = price;
      console.log("✅ Price sanitized to:", price);
    }
  }

  // Stock
  if (body.stock !== undefined) {
    console.log("📦 Raw stock value:", body.stock, "type:", typeof body.stock);
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      errors.push(`Invalid stock: ${body.stock}`);
    } else {
      data.stock = stock;
    }
  }

  // Category ID
  if (body.category_id !== undefined) {
    console.log("🏷️ Raw category_id:", body.category_id, "type:", typeof body.category_id);
    if (body.category_id === null || body.category_id === "") {
      data.category_id = null;
    } else {
      const catId = Number(body.category_id);
      if (Number.isNaN(catId)) {
        errors.push(`Invalid category_id: ${body.category_id}`);
      } else {
        data.category_id = catId;
      }
    }
  }

  // Image URL
  if (body.image_url !== undefined) {
    if (body.image_url === null || body.image_url === "") {
      data.image_url = null;
    } else {
      const url = String(body.image_url).trim();
      try {
        new URL(url);
        data.image_url = url;
      } catch {
        errors.push("Invalid image URL");
      }
    }
  }

  console.log("📤 Sanitized data:", JSON.stringify(data, null, 2));
  console.log("❌ Validation errors:", errors);

  return { data, errors };
}

// ─── GET ───────────────────────────────────────────────
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: { categories: true, reviews: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt(product));
  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// ─── PUT ───────────────────────────────────────────────
export async function PUT(request: Request, { params }: RouteParams) {
  console.log("🚀 PUT request started");

  try {
    const resolvedParams = await params;
    console.log("📎 Params:", resolvedParams);

    const id = parseInt(resolvedParams.id, 10);
    console.log("🆔 Parsed ID:", id);

    if (Number.isNaN(id)) {
      console.log("❌ Invalid ID");
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { data: updateData, errors } = sanitizeProductInput(body);

    if (errors.length > 0) {
      console.log("❌ Validation failed:", errors);
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    // Check if product exists
    console.log("🔎 Checking product existence...");
    const existingProduct = await prisma.products.findUnique({ where: { id } });
    if (!existingProduct) {
      console.log("❌ Product not found:", id);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log("✅ Product exists:", existingProduct.name);

    // If category_id provided, verify it exists
    if (updateData.category_id !== undefined && updateData.category_id !== null) {
      console.log("🔎 Verifying category...");
      const categoryExists = await prisma.categories.findUnique({
        where: { id: updateData.category_id as number },
      });
      if (!categoryExists) {
        console.log("❌ Category not found:", updateData.category_id);
        return NextResponse.json({ error: "Category not found" }, { status: 400 });
      }
    }

    console.log("📝 Updating product with:", JSON.stringify(updateData, null, 2));

    const updatedProduct = await prisma.products.update({
      where: { id },
      data: updateData as any,
      include: { categories: true },
    });

    console.log("✅ Product updated successfully:", updatedProduct.name);
    return NextResponse.json(serializeBigInt(updatedProduct));
  } catch (error) {
    console.error("❌ PUT ERROR:", error);

    // Detailed error logging
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma meta:", error.meta);
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "Failed to update product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ─── DELETE ────────────────────────────────────────────
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const existingProduct = await prisma.products.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.products.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Product has orders. Cannot delete." },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}