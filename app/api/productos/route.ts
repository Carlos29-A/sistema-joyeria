import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";
import { generateNextSku } from "@/lib/sku-generator";
import { auth } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const tipoJoya = searchParams.get("tipoJoya");
    const material = searchParams.get("material");
    const categoryId = searchParams.get("categoryId");
    const brandId = searchParams.get("brandId");

    const where: Record<string, unknown> = {};
    if (tipoJoya) where.tipoJoya = tipoJoya;
    if (material) where.material = material;
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { orden: "asc" },
            take: 1,
          },
          category: true,
          brand: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products.map((p) => ({
        ...p,
        costo: Number(p.costo),
        precioVenta: Number(p.precioVenta),
        pesoGramos: Number(p.pesoGramos),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

const createProductWithImagesSchema = createProductSchema.extend({
  imagenes: z.array(z.string().url()).min(1, "Debe subir al menos una imagen del producto"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "administrador") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = createProductWithImagesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { imagenes, ...productData } = parsed.data;
    const sku = await generateNextSku(prisma, productData.tipoJoya, productData.material);

    const producto = await prisma.product.create({
      data: {
        sku,
        tipoJoya: productData.tipoJoya,
        material: productData.material,
        kilataje: productData.kilataje ?? null,
        pesoGramos: productData.pesoGramos,
        costo: productData.costo,
        precioVenta: productData.precioVenta,
        stock: productData.stock,
        artesanal: productData.artesanal,
        descripcionArtesanal: productData.descripcionArtesanal ?? null,
        categoryId: productData.categoryId,
        brandId: productData.brandId ?? null,
      },
    });

    const imageRecords = await Promise.all(
      imagenes.map((url, i) =>
        prisma.productImage.create({
          data: {
            productId: producto.id,
            url,
            orden: i,
          },
        })
      )
    );

    return NextResponse.json(
      {
        ...producto,
        costo: Number(producto.costo),
        precioVenta: Number(producto.precioVenta),
        pesoGramos: Number(producto.pesoGramos),
        images: imageRecords,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
