import { z } from "zod";

const TIPO_JOYA = ["anillo", "collar", "pulsera", "arete", "dije", "otros"] as const;
const MATERIAL = ["oro", "plata", "platino", "acero", "otros"] as const;
const KILATAJE = ["14K", "18K", "24K"] as const;
const MATERIALES_CON_KILATAJE: readonly string[] = ["oro", "platino"];

export const createProductSchema = z
  .object({
    tipoJoya: z.enum(TIPO_JOYA, {
      message: "El tipo de joya es obligatorio",
    }),
    material: z.enum(MATERIAL, {
      message: "El material es obligatorio",
    }),
    kilataje: z.enum(KILATAJE, { message: "Kilataje no válido" }).nullable().optional(),
    pesoGramos: z
      .number({ message: "El peso en gramos es obligatorio" })
      .positive("El peso debe ser un valor positivo"),
    costo: z
      .number({ message: "El costo es obligatorio" })
      .nonnegative("El costo no puede ser negativo"),
    precioVenta: z
      .number({ message: "El precio de venta es obligatorio" })
      .nonnegative("El precio de venta no puede ser negativo"),
    stock: z
      .number({ message: "El stock es obligatorio" })
      .int("El stock debe ser un número entero")
      .nonnegative("El stock no puede ser negativo"),
    artesanal: z.boolean().default(false),
    descripcionArtesanal: z.string().optional(),
    categoryId: z.string({ message: "La categoría es obligatoria" }).min(1, "La categoría es obligatoria"),
    brandId: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (MATERIALES_CON_KILATAJE.includes(data.material)) {
        return !!data.kilataje;
      }
      return true;
    },
    {
      message: "El kilataje es obligatorio para oro y platino",
      path: ["kilataje"],
    }
  )
  .refine(
    (data) => {
      if (data.artesanal) {
        return !!data.descripcionArtesanal && data.descripcionArtesanal.trim().length > 0;
      }
      return true;
    },
    {
      message: "La descripción artesanal es obligatoria si el producto es artesanal",
      path: ["descripcionArtesanal"],
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    tipoJoya: z.enum(TIPO_JOYA).optional(),
    material: z.enum(MATERIAL).optional(),
    kilataje: z.enum(KILATAJE).nullable().optional(),
    pesoGramos: z.number().positive("El peso debe ser un valor positivo").optional(),
    costo: z.number().nonnegative("El costo no puede ser negativo").optional(),
    precioVenta: z.number().nonnegative("El precio de venta no puede ser negativo").optional(),
    stock: z.number().int("El stock debe ser un número entero").nonnegative("El stock no puede ser negativo").optional(),
    artesanal: z.boolean().optional(),
    descripcionArtesanal: z.string().optional(),
    categoryId: z.string().min(1, "La categoría es obligatoria").optional(),
    brandId: z.string().nullable().optional(),
  });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const generateSkuSchema = z.object({
  tipoJoya: z.enum(TIPO_JOYA),
  material: z.enum(MATERIAL),
});

export type GenerateSkuInput = z.infer<typeof generateSkuSchema>;
