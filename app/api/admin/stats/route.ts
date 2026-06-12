import { NextResponse } from "next/server";
import { AnalyticsService } from "../../../../lib/analytics";
import { serializeBigInt } from "@/lib/json";

// In-memory cache for intelligence stats (Simple 60s TTL)
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; 

export async function GET() {
  try {
    const now = Date.now();
    if (cache && now - cache.timestamp < CACHE_TTL) {
       return NextResponse.json(cache.data);
    }

    const [revenue, trend, categories, products, userStats, userTrend, stockStatus, sidebar] = await Promise.all([
      AnalyticsService.getRevenueStats(),
      AnalyticsService.getSalesTrend(30),
      AnalyticsService.getCategoryPerformance(),
      AnalyticsService.getTopProducts(10),
      AnalyticsService.getUserStats(30),
      AnalyticsService.getUserAcquisitionTrend(30),
      AnalyticsService.getStockStatus(),
      AnalyticsService.getSidebarCounts()
    ]);

    // Calculate conversion (simulated since we don't have traffic data yet)
    const conversionRate = 3.42; 

    const responseData = serializeBigInt({
      summary: {
        revenue: revenue.totalRevenue,
        orders: revenue.orderCount,
        aov: revenue.avgOrderValue,
        users: userStats.total,
        conversionRate,
        growth: 12.5, 
      },
      charts: {
        revenueTrend: trend,
        categoryBreakdown: categories,
        productPerformance: products,
        userTrend,
        stockStatus
      },
      sidebar
    });

    cache = { data: responseData, timestamp: now };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard intelligence" }, { status: 500 });
  }
}
