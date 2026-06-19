import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";
import { orders, order_items, products, users, categories } from "@prisma/client";

type OrderItemWithProduct = order_items & {
  products: Pick<products, "id" | "name" | "price" | "image_url"> | null;
};

type UserWithOrders = users & {
  orders: Pick<orders, "total">[];
  _count: {
    orders: number;
  };
};

type ProductWithCategoryAndItems = products & {
  categories: Pick<categories, "name"> | null;
  order_items: order_items[];
};

export async function GET(request: Request) {
  try {
    // 1. Sales by Month
    const orders: orders[] = await prisma.orders.findMany({
      where: { status: { not: "cancelled" } },
      orderBy: { created_at: "asc" },
    });

    const salesByMonth: Record<string, number> = {};
    orders.forEach((order: orders) => {
      const month = new Date(order.created_at || new Date()).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      salesByMonth[month] = (salesByMonth[month] || 0) + Number(order.total);
    });

    // 2. Top Selling Products
    const orderItems: OrderItemWithProduct[] = await prisma.order_items.findMany({
      include: {
        products: {
          select: { id: true, name: true, price: true, image_url: true },
        },
      },
    });

    const productSales: Record<number, { name: string; quantity: number; revenue: number }> = {};
    orderItems.forEach((item: OrderItemWithProduct) => {
      const pid = item.product_id;
      if (!productSales[pid]) {
        productSales[pid] = {
          name: item.products?.name || "Unknown",
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[pid].quantity += item.quantity;
      productSales[pid].revenue += Number(item.price) * item.quantity;
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 3. Top Customers
    const usersWithOrders: UserWithOrders[] = await prisma.users.findMany({
      where: {
        orders: {
          some: { status: { not: "cancelled" } },
        },
      },
      include: {
        orders: {
          where: { status: { not: "cancelled" } },
          select: { total: true },
        },
        _count: {
          select: { orders: true },
        },
      },
      take: 5,
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
    });

    const topCustomers = usersWithOrders.map((user: UserWithOrders) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ordersCount: user._count.orders,
      totalSpent: user.orders.reduce((sum: number, o: Pick<orders, "total">) => sum + Number(o.total), 0),
    }));

    // 4. Category Revenue
    const products: ProductWithCategoryAndItems[] = await prisma.products.findMany({
      include: {
        categories: { select: { name: true } },
        order_items: true,
      },
    });

    const categoryRevenue: Record<string, number> = {};
    products.forEach((p: ProductWithCategoryAndItems) => {
      const catName = p.categories?.name || "Uncategorized";
      const productRevenue = p.order_items.reduce(
        (sum: number, item: order_items) => sum + Number(item.price) * item.quantity,
        0
      );
      categoryRevenue[catName] = (categoryRevenue[catName] || 0) + productRevenue;
    });

    const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(
      serializeBigInt({
        salesByMonth: Object.entries(salesByMonth).map(([name, sales]) => ({ name, sales })),
        topProducts,
        topCustomers,
        categoryData,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, o: orders) => sum + Number(o.total), 0),
      })
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}