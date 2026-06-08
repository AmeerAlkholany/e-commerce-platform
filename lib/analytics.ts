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
    const orders = await prisma.orders.findMany({
      where: {
        status: { not: "cancelled" },
        ...(period ? { created_at: { gte: period.start, lte: period.end } } : {}),
      },
      select: { total: true, created_at: true },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = orders.length;

    return {
      totalRevenue,
      orderCount,
      avgOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
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
    const products = await prisma.products.findMany({
      select: { stock: true }
    });

    const status = {
      inStock: products.filter(p => (p.stock ?? 0) > 10).length,
      lowStock: products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length,
      outOfStock: products.filter(p => (p.stock ?? 0) === 0).length,
    };

    return [
      { name: "In Stock", value: status.inStock },
      { name: "Low Stock", value: status.lowStock },
      { name: "Out of Stock", value: status.outOfStock },
    ];
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
}
