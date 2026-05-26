import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sessionUser = await getUserFromRequest(request);

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized: No active session found" },
        { status: 401 }
      );
    }

    // Fetch latest user details from DB
    const user = await prisma.users.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: User not found in database" },
        { status: 401 }
      );
    }

    return NextResponse.json(serializeBigInt(user), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/auth/me:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user profile" },
      { status: 500 }
    );
  }
}
