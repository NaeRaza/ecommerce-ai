import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Size, Color } from "@/generated/client";
import z from "zod";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const productVariants = await prisma.productVariant.findMany({
      where: { productId: id },
    });

    return NextResponse.json(productVariants, { status: 200 });
  } catch (e) {
    console.log("[GET api/products/:id/variants]", e);

    return NextResponse.json(
      { error: "Failed to fetch all products variants" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const priceProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!priceProduct) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 },
      );
    }

    const schema = z.object({
      size: z.enum(Size),
      color: z.enum(Color),
      stock: z.number().int().min(0),
      price: z.number().positive().optional(),
    });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { size, color, stock, price } = parsed.data;

    const finalPrice = price ?? priceProduct.price;

    if (finalPrice == null) {
      return NextResponse.json({ error: "Prix introuvable" }, { status: 400 });
    }

    const sku = `${id}-${size}-${color}`;

    const productVariant = await prisma.productVariant.create({
      data: {
        size,
        color,
        stock,
        price: finalPrice,
        sku,
        productId: id,
      },
    });

    return NextResponse.json(productVariant, { status: 201 });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2002") {
      return NextResponse.json(
        { error: "Cette variante existe déjà" },
        { status: 409 },
      );
    }

    console.log("[POST api/products/:id/variants]", e);

    return NextResponse.json(
      { error: "Failed to create a product variant" },
      { status: 500 },
    );
  }
}
