import { CategoryManager } from "@/components/features/category-manager";

export default function AdminCategoriasPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Gestión
          </p>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Categorías
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Organiza tus productos en categorías para facilitar la navegación.
        </p>
      </div>

      <CategoryManager />
    </div>
  );
}
