const TIPO_JOYA_ABBR: Record<string, string> = {
  anillo: "ANI",
  collar: "COL",
  pulsera: "PUL",
  arete: "ARE",
  dije: "DIJ",
  otros: "OTR",
};

const MATERIAL_ABBR: Record<string, string> = {
  oro: "ORO",
  plata: "PLA",
  platino: "PLT",
  acero: "ACE",
  otros: "OTR",
};

export function getSkuPrefix(tipoJoya: string, material: string): string {
  const tipo = TIPO_JOYA_ABBR[tipoJoya] ?? "UNK";
  const mat = MATERIAL_ABBR[material] ?? "UNK";
  return `${tipo}-${mat}`;
}

export function buildSkuPreview(tipoJoya: string, material: string, consecutivo: number): string {
  const prefix = getSkuPrefix(tipoJoya, material);
  const consecutivoStr = String(consecutivo).padStart(3, "0");
  return `${prefix}-${consecutivoStr}`;
}

export async function generateNextSku(
  prisma: { product: { count: (args: { where: { sku: { startsWith: string } } }) => Promise<number> } },
  tipoJoya: string,
  material: string,
): Promise<string> {
  const prefix = getSkuPrefix(tipoJoya, material);
  const count = await prisma.product.count({
    where: { sku: { startsWith: prefix } },
  });
  const next = count + 1;
  const consecutivoStr = String(next).padStart(3, "0");
  return `${prefix}-${consecutivoStr}`;
}
