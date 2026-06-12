import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids, deleteProducts, deleteSubCategories } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid IDs provided" },
        { status: 400 }
      );
    }

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
        await prisma.products.updateMany({
          where: { category_id: catId },
          data: { category_id: null },
        });
      }

      // 3. Delete category
      try {
        await prisma.categories.delete({
          where: { id: catId },
        });
      } catch (e) {
        // If already deleted by recursive call, ignore
      }
    };

    for (const id of ids) {
       // Check if category still exists (might have been deleted as a sub-category)
       const exists = await prisma.categories.findUnique({ where: { id: parseInt(id.toString()) } });
       if (exists) {
         await deleteCategoryRecursive(parseInt(id.toString()));
       }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    return NextResponse.json(
      { error: "Failed to bulk delete categories" },
      { status: 500 }
    );
  }
}
