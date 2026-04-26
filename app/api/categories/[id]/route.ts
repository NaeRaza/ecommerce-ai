import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import z from "zod";

//Get a category with an ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category doesn't exist" },
        { status: 404 },
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (e) {
    console.log("[GET api/categories/:id]", e);

    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

//PUT change a category
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const schema = z.object({
      name: z.string().min(2),
    });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    const { name } = parsed.data;
    const slug = slugify(name);

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (e) {
    console.log("[PUT api/categories/:id]", e);

    return NextResponse.json(
      { error: "Failed to change the category" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    console.log("[DELETE api/categories/:id]", e);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
