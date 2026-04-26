import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import z from "zod";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (e) {
    console.log("[GET api/products/:id]", e);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const schema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(10).optional(),
      price: z.number().positive().optional(),
      categoryId: z.string().optional(),
      images: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { name, description, price, categoryId, images, isActive } =
      parsed.data;

    const slug = name ? slugify(name) : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description && { description }),
        ...(price && { price }),
        ...(categoryId && { categoryId }),
        ...(images && { images }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2002") {
      return NextResponse.json(
        { error: "Ce produit existe déjà" },
        { status: 409 },
      );
    }
    console.log("[PUT api/products/:id]", e);

    return NextResponse.json(
      { error: "Failed to change a product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log("[DELETE api/products/:id]", e);

    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 },
    );
  }
}
