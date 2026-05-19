import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const carts = await prisma.users.findMany();
  return NextResponse.json(carts);
}
