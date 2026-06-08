import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSkuSchema } from "@/lib/validations/product";
import { generateNextSku } from "@/lib/sku-generator";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

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
    const parsed = generateSkuSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { tipoJoya, material } = parsed.data;
    const sku = await generateNextSku(prisma, tipoJoya, material);

    return NextResponse.json({ sku });
  } catch (error) {
    console.error("Error al generar SKU:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
