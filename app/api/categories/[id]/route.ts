import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const body = await request.json();
    const { name, parent_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const category = await prisma.categories.update({
      where: { id },
      data: {
        name,
        parent_id: parent_id ? parseInt(parent_id.toString()) : null,
      },
    });

    return NextResponse.json(serializeBigInt(category));
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const { searchParams } = new URL(request.url);
    const deleteProducts = searchParams.get("deleteProducts") === "true";
    const deleteSubCategories = searchParams.get("deleteSubCategories") === "true";

    // Recursive deletion helper
    const deleteCategoryRecursive = async (catId: number) => {
      // 1. Handle sub-categories
      const subCats = await prisma.categories.findMany({
        where: { parent_id: catId },
      });

      if (deleteSubCategories) {
        for (const sub of subCats) {
          await deleteCategoryRecursive(sub.id);
        }
      } else {
        // Move sub-categories to top level if not deleting them
        await prisma.categories.updateMany({
          where: { parent_id: catId },
          data: { parent_id: null },
        });
      }

      // 2. Handle products
      if (deleteProducts) {
        await prisma.products.deleteMany({
          where: { category_id: catId },
        });
      } else {
        // Uncategorize products
        await prisma.products.updateMany({
          where: { category_id: catId },
          data: { category_id: null },
        });
      }

      // 3. Delete the category itself
      return await prisma.categories.delete({
        where: { id: catId },
      });
    };

    await deleteCategoryRecursive(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
