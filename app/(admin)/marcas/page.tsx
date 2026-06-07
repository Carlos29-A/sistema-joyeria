import { BrandManager } from "@/components/features/brand-manager";

export default function AdminMarcasPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Gestión
          </p>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Marcas
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Administra las marcas asociadas a tus productos.
        </p>
      </div>

      <BrandManager />
    </div>
  );
}
