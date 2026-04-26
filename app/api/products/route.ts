import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, variants: true },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    console.log("[GET api/products]", e);

    return NextResponse.json(
      { error: "Failed to fetch all products" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const schema = z.object({
      name: z.string().min(2),
      description: z.string().min(10),
      price: z.number().positive(),
      categoryId: z.string(),
      images: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { name, description, price, categoryId, images, isActive } =
      parsed.data;

    const slug = slugify(name);

    const products = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        images,
        isActive,
      },
    });

    return NextResponse.json(products, { status: 201 });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2002") {
      return NextResponse.json(
        { error: "Ce produit existe déjà" },
        { status: 409 },
      );
    }

    console.log("[POST api/products]", e);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
