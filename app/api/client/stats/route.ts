import { NextResponse } from "next/server";
import { AnalyticsService } from "@/lib/analytics";
import { getUserFromRequest } from "@/lib/session";
import { serializeBigInt } from "@/lib/json";

export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await AnalyticsService.getClientStats(user.id);

    return NextResponse.json(serializeBigInt({
      ...stats,
      user: {
        name: user.name,
        email: user.email
      }
    }));
  } catch (error) {
    console.error("Client Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard intelligence" }, { status: 500 });
  }
}
