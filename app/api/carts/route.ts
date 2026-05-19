import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreateCartSchema } from "./schema";

export async function GET() {
  const carts = await prisma.carts.findMany();
  return NextResponse.json(carts);
}

export async function POST(request: Request) {
  try {
  // 1. Parse the incoming JSON body
  const body = await request.json();

  // 2. Validate the body using Zod
  const result = CreateCartSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // 3. Save to Database via Prisma
  const user = await prisma.carts.create({
    data: result.data,
  });

  return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}


