export const TIPOS_JOYA = [
  { value: "anillo", label: "Anillo" },
  { value: "collar", label: "Collar" },
  { value: "pulsera", label: "Pulsera" },
  { value: "arete", label: "Arete" },
  { value: "dije", label: "Dije" },
  { value: "otros", label: "Otros" },
] as const;

export const MATERIALES = [
  { value: "oro", label: "Oro" },
  { value: "plata", label: "Plata" },
  { value: "platino", label: "Platino" },
  { value: "acero", label: "Acero" },
  { value: "otros", label: "Otros" },
] as const;

export const KILATAJES = [
  { value: "14K", label: "14K" },
  { value: "18K", label: "18K" },
  { value: "24K", label: "24K" },
] as const;

export const MATERIALES_CON_KILATAJE = ["oro", "platino"] as readonly string[];

export const ROLES = [
  { value: "administrador", label: "Administrador" },
  { value: "vendedor", label: "Vendedor" },
] as const;
