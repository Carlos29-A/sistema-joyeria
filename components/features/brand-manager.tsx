"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useBrands, type Brand } from "@/hooks/use-brands";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Plus, Award, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const brandSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
});

type BrandFormData = z.infer<typeof brandSchema>;

export function BrandManager() {
  const { brands, loading, reload } = useBrands();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "" },
  });

  const filtered = useMemo(() => {
    return brands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search]);

  function openCreate() {
    reset({ name: "" });
    setEditingBrand(null);
    setShowCreateModal(true);
  }

  function openEdit(brand: Brand) {
    reset({ name: brand.name });
    setEditingBrand(brand);
    setShowCreateModal(true);
  }

  function closeModal() {
    setShowCreateModal(false);
    setEditingBrand(null);
    reset({ name: "" });
  }

  async function onSubmit(data: BrandFormData) {
    setSubmitting(true);
    try {
      if (editingBrand) {
        await api.put(`/api/marcas/${editingBrand.id}`, data);
        toast.success("Marca actualizada");
      } else {
        await api.post("/api/marcas", data);
        toast.success("Marca creada");
      }
      await reload();
      closeModal();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Error al guardar la marca");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingBrand) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/marcas/${deletingBrand.id}`);
      toast.success("Marca eliminada");
      await reload();
      setDeletingBrand(null);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Error al eliminar la marca");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreate} variant="gold">
          <Plus className="mr-2 h-4 w-4" />
          Nueva marca
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Award className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-zinc-900">
            {search ? "Sin resultados" : "No hay marcas"}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {search ? "Intenta con otro término." : "Crea la primera marca para empezar."}
          </p>
          {!search && (
            <Button onClick={openCreate} variant="gold" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Crear marca
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((brand, i) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:border-amber-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                  <Award className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-zinc-900 truncate">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {brand._count?.products ?? 0}{" "}
                    {brand._count?.products === 1 ? "producto" : "productos"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(brand)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingBrand(brand)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={closeModal}
        title={editingBrand ? "Editar marca" : "Nueva marca"}
        description={
          editingBrand
            ? "Modifica el nombre de la marca."
            : "Crea una nueva marca para asociar a productos."
        }
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Nombre</Label>
            <Input
              id="brand-name"
              placeholder="Ej: Cartier"
              maxLength={100}
              autoFocus
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gold" isLoading={submitting}>
              {editingBrand ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDelete}
        title="Eliminar marca"
        description={
          deletingBrand
            ? `¿Estás seguro de eliminar "${deletingBrand.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={submitting}
      />
    </>
  );
}
