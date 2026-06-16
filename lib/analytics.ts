// Luxury Analytics Engine - v2
import { prisma } from "./prisma";

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
}

export class AnalyticsService {
  /**
   * Get total revenue and growth over a period
   */
  static async getRevenueStats(period?: AnalyticsPeriod) {
    const aggregations = await prisma.orders.aggregate({
      where: {
        status: { not: "cancelled" },
        ...(period ? { created_at: { gte: period.start, lte: period.end } } : {}),
      },
      _sum: { total: true },
      _count: { id: true },
      _avg: { total: true }
    });

    return {
      totalRevenue: Number(aggregations._sum.total || 0),
      orderCount: aggregations._count.id,
      avgOrderValue: Number(aggregations._avg.total || 0),
    };
  }

  /**
   * Get sales trend data for charts
   */
  static async getSalesTrend(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.orders.findMany({
      where: {
        status: { not: "cancelled" },
        created_at: { gte: startDate },
      },
      select: { total: true, created_at: true },
      orderBy: { created_at: "asc" },
    });

    const trend: Record<string, { date: string; revenue: number; orders: number }> = {};
    
    // Initialize days
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      trend[key] = { date: key, revenue: 0, orders: 0 };
    }

    orders.forEach((o) => {
      if (!o.created_at) return;
      const key = o.created_at.toISOString().split("T")[0];
      if (trend[key]) {
        trend[key].revenue += Number(o.total);
        trend[key].orders += 1;
      }
    });

    return Object.values(trend).map(t => ({
      ...t,
      aov: t.orders > 0 ? t.revenue / t.orders : 0
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get user acquisition trend (daily new users)
   */
  static async getUserAcquisitionTrend(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await prisma.users.findMany({
      where: { created_at: { gte: startDate } },
      select: { created_at: true },
      orderBy: { created_at: "asc" },
    });

    const trend: Record<string, { date: string; users: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      trend[key] = { date: key, users: 0 };
    }

    users.forEach((u) => {
      if (!u.created_at) return;
      const key = u.created_at.toISOString().split("T")[0];
      if (trend[key]) {
        trend[key].users += 1;
      }
    });

    return Object.values(trend).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get stock status categorization
   */
  static async getStockStatus() {
    const [inStock, lowStock, outOfStock] = await Promise.all([
      prisma.products.count({ where: { stock: { gt: 10 } } }),
      prisma.products.count({ where: { stock: { gt: 0, lte: 10 } } }),
      prisma.products.count({ where: { stock: 0 } }),
    ]);

    return [
      { name: "In Stock", value: inStock },
      { name: "Low Stock", value: lowStock },
      { name: "Out of Stock", value: outOfStock },
    ];
  }

  /**
   * Consolidate sidebar counts into a single rapid fetch
   */
  static async getSidebarCounts() {
    const [products, orders, categories, users, payments] = await Promise.all([
      prisma.products.count(),
      prisma.orders.count(),
      prisma.categories.count(),
      prisma.users.count(),
      prisma.payments.count()
    ]);
    return { products, orders, categories, users, payments };
  }

  /**
   * Get category performance
   */
  static async getCategoryPerformance() {
    const categories = await prisma.categories.findMany({
      include: {
        products: {
          include: {
            order_items: true,
          },
        },
      },
    });

    return categories.map((cat) => {
      const revenue = cat.products.reduce((sum, prod) => {
        return sum + prod.order_items.reduce((pSum, item) => pSum + Number(item.price) * item.quantity, 0);
      }, 0);

      return {
        name: cat.name,
        value: revenue,
        productCount: cat.products.length,
      };
    }).sort((a, b) => b.value - a.value);
  }

  /**
   * Get top performing products
   */
  static async getTopProducts(limit: number = 5) {
    const products = await prisma.products.findMany({
      include: {
        order_items: {
          select: {
            quantity: true,
            price: true
          }
        }
      }
    });

    return products.map(p => {
      const totalRevenue = p.order_items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      const totalSold = p.order_items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        id: p.id,
        name: p.name,
        revenue: totalRevenue,
        sold: totalSold,
        image: p.image_url
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, limit);
  }

  /**
   * Get user acquisition stats summary
   */
  static async getUserStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalUsers = await prisma.users.count();
    const newUsers = await prisma.users.count({
      where: { created_at: { gte: startDate } }
    });

    return {
      total: totalUsers,
      new: newUsers,
      growthRate: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0
    };
  }

  /**
   * Get client-specific stats (revenue, active orders, total spent)
   */
  static async getClientStats(userId: number) {
    const [revenueAgg, orders, trend] = await Promise.all([
      prisma.orders.aggregate({
        where: { user_id: userId, status: { not: "cancelled" } },
        _sum: { total: true },
        _count: { id: true },
        _avg: { total: true }
      }),
      prisma.orders.findMany({
        where: { user_id: userId },
        select: { status: true }
      }),
      this.getClientSalesTrend(userId, 30)
    ]);

    const activeOrders = orders.filter(o => o.status === "pending" || o.status === "paid" || o.status === "shipped").length;
    const completedOrders = orders.filter(o => o.status === "delivered").length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    return {
      summary: {
        totalSpent: Number(revenueAgg._sum.total || 0),
        totalOrders: revenueAgg._count.id,
        avgOrderValue: Number(revenueAgg._avg.total || 0),
        activeOrders,
        completedOrders,
        pendingOrders,
        status: "Active" 
      },
      charts: {
        spendingTrend: trend
      }
    };
  }

  /**
   * Get sales trend data for a specific client
   */
  static async getClientSalesTrend(userId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.orders.findMany({
      where: {
        user_id: userId,
        status: { not: "cancelled" },
        created_at: { gte: startDate },
      },
      select: { total: true, created_at: true },
      orderBy: { created_at: "asc" },
    });

    const trend: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      trend[key] = { date: key, revenue: 0, orders: 0 };
    }

    orders.forEach((o) => {
      if (!o.created_at) return;
      const key = o.created_at.toISOString().split("T")[0];
      if (trend[key]) {
        trend[key].revenue += Number(o.total);
        trend[key].orders += 1;
      }
    });

    return Object.values(trend).sort((a, b) => a.date.localeCompare(b.date));
  }
}
