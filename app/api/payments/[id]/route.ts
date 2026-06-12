import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/json";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { status, method, transaction_id } = body;

    const updatedPayment = await prisma.payments.update({
      where: { id },
      data: {
        status,
        method,
        transaction_id,
      },
      include: {
        orders: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    // Business Logic: If payment is marked as "paid", we should also update the order status
    if (status === "paid" && updatedPayment.order_id) {
      await prisma.orders.update({
        where: { id: updatedPayment.order_id },
        data: { status: "paid" }
      });
    }

    return NextResponse.json(serializeBigInt(updatedPayment));
  } catch (error) {
    console.error(`Error updating payment ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
