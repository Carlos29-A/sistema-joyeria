"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ImageUpload } from "@/components/features/image-upload";
import { toast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { api } from "@/lib/api";
import { KILATAJES, MATERIALES, MATERIALES_CON_KILATAJE, TIPOS_JOYA } from "@/lib/catalogs";
import { createProductSchema } from "@/lib/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductFormModal({ isOpen, onClose, onSuccess }: ProductFormModalProps) {
  const { categories, loading: loadingCategories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [skuPreview, setSkuPreview] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      tipoJoya: "" as "anillo" | "collar" | "pulsera" | "arete" | "dije" | "otros",
      material: "" as "oro" | "plata" | "platino" | "acero" | "otros",
      kilataje: null,
      pesoGramos: 0,
      costo: 0,
      precioVenta: 0,
      stock: 0,
      artesanal: false,
      descripcionArtesanal: "",
      categoryId: "",
      brandId: "",
    },
  });

  const tipoJoya = watch("tipoJoya");
  const material = watch("material");
  const artesanal = watch("artesanal");
  const showKilataje = material && MATERIALES_CON_KILATAJE.includes(material);

  useEffect(() => {
    if (tipoJoya && material) {
      api
        .post<{ sku: string }>("/api/productos/generar-sku", { tipoJoya, material })
        .then((res) => setSkuPreview(res.sku))
        .catch(() => setSkuPreview(""));
    } else {
      setSkuPreview("");
    }
  }, [tipoJoya, material]);

  useEffect(() => {
    if (!showKilataje) {
      setValue("kilataje", null);
    }
  }, [showKilataje, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImages([]);
      setSkuPreview("");
      setImageError("");
    }
  }, [isOpen, reset]);

  async function onSubmit(data: unknown) {
    const values = data as {
      tipoJoya: string;
      material: string;
      kilataje: string | null;
      pesoGramos: number;
      costo: number;
      precioVenta: number;
      stock: number;
      artesanal: boolean;
      descripcionArtesanal?: string;
      categoryId: string;
      brandId?: string | null;
    };

    if (!values.categoryId) {
      toast.error("Selecciona una categoría");
      return;
    }

    if (images.length === 0) {
      setImageError("Debes subir al menos una imagen del producto");
      return;
    }
    setImageError("");
    setIsSubmitting(true);

    try {
      const payload = {
        tipoJoya: values.tipoJoya,
        material: values.material,
        kilataje: values.kilataje,
        pesoGramos: values.pesoGramos,
        costo: values.costo,
        precioVenta: values.precioVenta,
        stock: values.stock,
        artesanal: values.artesanal,
        descripcionArtesanal: values.descripcionArtesanal || null,
        categoryId: values.categoryId,
        brandId: values.brandId && values.brandId !== "" ? values.brandId : null,
        imagenes: images.map((img) => img.url),
      };

      await api.post("/api/productos", payload);

      toast.success("Producto registrado", {
        description: `SKU: ${skuPreview}`,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Error al registrar el producto");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva pieza"
      description="Completa los detalles para registrar una nueva pieza en el catálogo."
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <AnimatePresence>
          {skuPreview && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <Sparkles className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  SKU generado
                </p>
                <p className="mt-0.5 font-mono text-lg font-bold text-emerald-900">
                  {skuPreview}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">Clasificación</h3>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                prompt={loadingCategories ? "Cargando..." : "Seleccionar"}
                error={errors.categoryId?.message}
                disabled={loadingCategories}
                {...register("categoryId")}
              />
            </div>

            <div className="space-y-2">
              <Label>Marca</Label>
              <Select
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
                prompt={loadingBrands ? "Cargando..." : "Sin marca"}
                disabled={loadingBrands}
                {...register("brandId")}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">Detalles</h3>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipo de joya *</Label>
              <Select
                options={TIPOS_JOYA.map((t) => ({ value: t.value, label: t.label }))}
                prompt="Seleccionar"
                error={errors.tipoJoya?.message}
                {...register("tipoJoya")}
              />
            </div>

            <div className="space-y-2">
              <Label>Material *</Label>
              <Select
                options={MATERIALES.map((m) => ({ value: m.value, label: m.label }))}
                prompt="Seleccionar"
                error={errors.material?.message}
                {...register("material")}
              />
            </div>

            <AnimatePresence>
              {showKilataje && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label>Kilataje *</Label>
                  <Select
                    options={KILATAJES.map((k) => ({ value: k.value, label: k.label }))}
                    prompt="Seleccionar"
                    error={errors.kilataje?.message}
                    {...register("kilataje")}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label>Peso (gramos) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.pesoGramos?.message}
                {...register("pesoGramos", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">Comercial</h3>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Costo (S/) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.costo?.message}
                {...register("costo", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Precio venta (S/) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.precioVenta?.message}
                {...register("precioVenta", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input
                type="number"
                placeholder="0"
                error={errors.stock?.message}
                {...register("stock", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">Artesanal</h3>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                id="artesanal"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 transition-colors"
                {...register("artesanal")}
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                Marcar como producto artesanal
              </span>
            </label>

            <AnimatePresence>
              {artesanal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label>Descripción del proceso *</Label>
                    <textarea
                      rows={3}
                      placeholder="Describe el proceso de elaboración..."
                      className="flex w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-600 transition-all"
                      {...register("descripcionArtesanal")}
                    />
                    {errors.descripcionArtesanal && (
                      <p className="flex items-center gap-1 text-xs font-medium text-red-600">
                        {errors.descripcionArtesanal.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">Imágenes</h3>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <ImageUpload
            value={images}
            onChange={(imgs) => {
              setImages(imgs);
              setImageError("");
            }}
            error={imageError}
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 sticky bottom-0 bg-white pb-1">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isSubmitting}
            className="min-w-[180px]"
          >
            Registrar producto
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
