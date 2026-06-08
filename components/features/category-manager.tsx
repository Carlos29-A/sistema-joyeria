"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useCategories, type Category } from "@/hooks/use-categories";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Plus, Tag, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoryManager() {
  const { categories, loading, reload } = useCategories();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  function openCreate() {
    reset({ name: "" });
    setEditingCategory(null);
    setShowCreateModal(true);
  }

  function openEdit(category: Category) {
    reset({ name: category.name });
    setEditingCategory(category);
    setShowCreateModal(true);
  }

  function closeModal() {
    setShowCreateModal(false);
    setEditingCategory(null);
    reset({ name: "" });
  }

  async function onSubmit(data: CategoryFormData) {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/api/categorias/${editingCategory.id}`, data);
        toast.success("Categoría actualizada");
      } else {
        await api.post("/api/categorias", data);
        toast.success("Categoría creada");
      }
      await reload();
      closeModal();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Error al guardar la categoría");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/categorias/${deletingCategory.id}`);
      toast.success("Categoría eliminada");
      await reload();
      setDeletingCategory(null);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Error al eliminar la categoría");
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
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreate} variant="gold">
          <Plus className="mr-2 h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Tag className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-zinc-900">
            {search ? "Sin resultados" : "No hay categorías"}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {search ? "Intenta con otro término." : "Crea la primera categoría para empezar."}
          </p>
          {!search && (
            <Button onClick={openCreate} variant="gold" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Crear categoría
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((category, i) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <Tag className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-zinc-900 truncate">
                    {category.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {category._count?.products ?? 0}{" "}
                    {category._count?.products === 1 ? "producto" : "productos"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(category)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingCategory(category)}
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
        title={editingCategory ? "Editar categoría" : "Nueva categoría"}
        description={
          editingCategory
            ? "Modifica el nombre de la categoría."
            : "Crea una nueva categoría para agrupar productos."
        }
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nombre</Label>
            <Input
              id="category-name"
              placeholder="Ej: Anillos"
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
              {editingCategory ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        description={
          deletingCategory
            ? `¿Estás seguro de eliminar "${deletingCategory.name}"? Esta acción no se puede deshacer.`
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
