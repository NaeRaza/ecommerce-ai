import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { OrderStatus } from "@/generated/client";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true, items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (e) {
    console.log("[GET api/orders/:id]", e);

    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const schema = z.object({
      status: z.enum(OrderStatus),
    });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { status } = parsed.data;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.log("[PATCH api/orders/:id]", e);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
