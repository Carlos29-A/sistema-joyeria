import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MATERIALES, TIPOS_JOYA } from "@/lib/catalogs";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { cn } from "@/lib/utils";
import { Search, Filter, X } from "lucide-react";

interface ProductFiltersProps {
  filters: {
    tipoJoya: string;
    material: string;
    categoryId: string;
    brandId: string;
    search: string;
  };
  onChange: (filters: {
    tipoJoya: string;
    material: string;
    categoryId: string;
    brandId: string;
    search: string;
  }) => void;
  className?: string;
}

export function ProductFilters({ filters, onChange, className }: ProductFiltersProps) {
  const { categories, loading: loadingCategories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands();

  const hasFilters =
    filters.tipoJoya ||
    filters.material ||
    filters.categoryId ||
    filters.brandId ||
    filters.search;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-emerald-600" />
        <h3 className="text-sm font-semibold text-zinc-900">Filtros</h3>
        {hasFilters && (
          <button
            onClick={() =>
              onChange({
                tipoJoya: "",
                material: "",
                categoryId: "",
                brandId: "",
                search: "",
              })
            }
            className="ml-auto inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar por SKU..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          options={TIPOS_JOYA.map((t) => ({ value: t.value, label: t.label }))}
          prompt="Tipo de joya"
          value={filters.tipoJoya}
          onChange={(e) => onChange({ ...filters, tipoJoya: e.target.value })}
        />

        <Select
          options={MATERIALES.map((m) => ({ value: m.value, label: m.label }))}
          prompt="Material"
          value={filters.material}
          onChange={(e) => onChange({ ...filters, material: e.target.value })}
        />

        <Select
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          prompt={loadingCategories ? "Cargando categorías..." : "Categoría"}
          value={filters.categoryId}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value })}
          disabled={loadingCategories}
        />

        <Select
          options={brands.map((b) => ({ value: b.id, label: b.name }))}
          prompt={loadingBrands ? "Cargando marcas..." : "Marca"}
          value={filters.brandId}
          onChange={(e) => onChange({ ...filters, brandId: e.target.value })}
          disabled={loadingBrands}
        />
      </div>
    </div>
  );
}
