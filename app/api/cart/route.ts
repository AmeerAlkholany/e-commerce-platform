import { NextResponse } from "next/server";

// This route has been moved to /api/carts to match REST naming conventions
export async function GET() {
  return NextResponse.json({ message: "This endpoint has been moved to /api/carts" }, { status: 301 });
}
export async function POST() {
  return NextResponse.json({ message: "This endpoint has been moved to /api/carts" }, { status: 301 });
}
export async function PUT() {
  return NextResponse.json({ message: "This endpoint has been moved to /api/carts" }, { status: 301 });
}
export async function DELETE() {
  return NextResponse.json({ message: "This endpoint has been moved to /api/carts" }, { status: 301 });
}
