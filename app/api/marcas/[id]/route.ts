import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateBrandSchema } from "@/lib/validations/brand";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error al obtener marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "administrador") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.brand.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateBrandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const duplicate = await prisma.brand.findFirst({
      where: {
        name: parsed.data.name,
        id: { not: id },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "Ya existe una marca con ese nombre" },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { name: parsed.data.name },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error al actualizar marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "administrador") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 });
    }

    if (existing._count.products > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar la marca porque tiene productos asociados" },
        { status: 409 }
      );
    }

    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ message: "Marca eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
