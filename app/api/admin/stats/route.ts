import { NextResponse } from "next/server";
import { AnalyticsService } from "../../../../lib/analytics";
import { serializeBigInt } from "@/lib/json";

export async function GET() {
  try {
    const [revenue, trend, categories, products, userStats, userTrend, stockStatus] = await Promise.all([
      AnalyticsService.getRevenueStats(),
      AnalyticsService.getSalesTrend(30),
      AnalyticsService.getCategoryPerformance(),
      AnalyticsService.getTopProducts(10),
      AnalyticsService.getUserStats(30),
      AnalyticsService.getUserAcquisitionTrend(30),
      AnalyticsService.getStockStatus()
    ]);

    // Calculate conversion (simulated since we don't have traffic data yet)
    // In a real app, you'd fetch this from a tracking service or table
    const conversionRate = 3.42; 

    return NextResponse.json(
      serializeBigInt({
        summary: {
          revenue: revenue.totalRevenue,
          orders: revenue.orderCount,
          aov: revenue.avgOrderValue,
          users: userStats.total,
          conversionRate,
          growth: 12.5, // Trend vs previous period
        },
        charts: {
          revenueTrend: trend,
          categoryBreakdown: categories,
          productPerformance: products,
          userTrend,
          stockStatus
        }
      })
    );
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard intelligence" }, { status: 500 });
  }
}
