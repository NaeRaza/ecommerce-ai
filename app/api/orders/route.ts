import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (e) {
    console.log("[GET api/orders]", e);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const schema = z.object({
      userId: z.string(),
      stripePaymentIntentId: z.string().optional(),
      total: z.number().positive(),
      items: z.array(
        z.object({
          variantId: z.string(),
          productId: z.string(),
          quantity: z.number().int().min(1),
          price: z.number().positive(),
        }),
      ),
    });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { userId, stripePaymentIntentId, total, items } = parsed.data;

    // 1. Créer la commande avec les items
    const order = await prisma.order.create({
      data: {
        userId,
        stripePaymentIntentId,
        total,
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // 2. Décrémenter le stock pour chaque item
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2002") {
      return NextResponse.json(
        { error: "Order with the same reference already exists" },
        { status: 409 },
      );
    }

    console.log("[POST api/orders]", e);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
