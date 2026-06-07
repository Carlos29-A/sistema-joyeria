import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";
import { generateNextSku } from "@/lib/sku-generator";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const tipoJoya = searchParams.get("tipoJoya");
    const material = searchParams.get("material");

    const where: Record<string, unknown> = {};
    if (tipoJoya) where.tipoJoya = tipoJoya;
    if (material) where.material = material;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { orden: "asc" },
            take: 1,
          },
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

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "El contenido debe ser multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const tipoJoya = formData.get("tipoJoya") as string;
    const material = formData.get("material") as string;
    const kilatajeRaw = formData.get("kilataje");
    const pesoGramosRaw = formData.get("pesoGramos");
    const costoRaw = formData.get("costo");
    const precioVentaRaw = formData.get("precioVenta");
    const stockRaw = formData.get("stock");
    const artesanalRaw = formData.get("artesanal");
    const descripcionArtesanal = formData.get("descripcionArtesanal") as string | null;

    const payload = {
      tipoJoya,
      material,
      kilataje: kilatajeRaw && kilatajeRaw !== "null" && kilatajeRaw !== "" ? kilatajeRaw : null,
      pesoGramos: pesoGramosRaw ? Number(pesoGramosRaw) : undefined,
      costo: costoRaw ? Number(costoRaw) : undefined,
      precioVenta: precioVentaRaw ? Number(precioVentaRaw) : undefined,
      stock: stockRaw ? Number(stockRaw) : undefined,
      artesanal: artesanalRaw === "true" || artesanalRaw === "on",
      descripcionArtesanal: descripcionArtesanal || undefined,
    };

    const parsed = createProductSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const imageFiles = formData.getAll("imagenes") as File[];
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "Debe subir al menos una imagen del producto" },
        { status: 400 }
      );
    }

    const sku = await generateNextSku(prisma, parsed.data.tipoJoya, parsed.data.material);

    const producto = await prisma.product.create({
      data: {
        sku,
        tipoJoya: parsed.data.tipoJoya,
        material: parsed.data.material,
        kilataje: parsed.data.kilataje ?? null,
        pesoGramos: parsed.data.pesoGramos,
        costo: parsed.data.costo,
        precioVenta: parsed.data.precioVenta,
        stock: parsed.data.stock,
        artesanal: parsed.data.artesanal,
        descripcionArtesanal: parsed.data.descripcionArtesanal ?? null,
      },
    });

    const imageRecords = [];
    const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
    const fs = await import("fs/promises");
    const path = await import("path");

    await fs.mkdir(path.join(process.cwd(), uploadDir, producto.id), { recursive: true });

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${i}.${extension}`;
      const relativePath = `/uploads/${producto.id}/${filename}`;
      const absolutePath = path.join(process.cwd(), "public", relativePath);

      await fs.writeFile(absolutePath, buffer);

      const image = await prisma.productImage.create({
        data: {
          productId: producto.id,
          url: relativePath,
          orden: i,
        },
      });

      imageRecords.push(image);
    }

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
