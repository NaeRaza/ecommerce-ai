import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import z from "zod";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json(categories, { status: 200 });
  } catch (e) {
    console.log("[GET api/categories]", e);

    return NextResponse.json(
      { error: "Failed to fetch all categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const schema = z.object({
      name: z.string().min(2),
    });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    const { name } = parsed.data;
    const slug = slugify(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2002") {
      return NextResponse.json(
        { error: "Cette catégorie existe déjà" },
        { status: 409 },
      );
    }
    console.log("[POST api/categories]", e);

    return NextResponse.json(
      { error: "Failed to create a category" },
      { status: 500 },
    );
  }
}
