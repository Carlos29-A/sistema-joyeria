"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/features/product-card";
import { ProductFilters } from "@/components/features/product-filters";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Package, Loader2, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  sku: string;
  tipoJoya: string;
  material: string;
  kilataje?: string | null;
  pesoGramos: number;
  costo: number;
  precioVenta: number;
  stock: number;
  artesanal: boolean;
  images: { url: string }[];
  category?: { id: string; name: string };
  brand?: { id: string; name: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PublicProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState({
    tipoJoya: "",
    material: "",
    categoryId: "",
    brandId: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const params: Record<string, string> = {};
        if (filters.tipoJoya) params.tipoJoya = filters.tipoJoya;
        if (filters.material) params.material = filters.material;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.brandId) params.brandId = filters.brandId;
        params.page = "1";
        params.limit = "20";

        const res = await api.get<{ data: Product[]; pagination: Pagination }>(
          "/api/productos",
          params
        );
        setProducts(res.data);
        setPagination(res.pagination);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [filters.tipoJoya, filters.material, filters.categoryId, filters.brandId]);

  const filteredProducts = products.filter((p) => {
    if (filters.search && !p.sku.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Colección
          </p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900">
            Nuestras Piezas
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {pagination?.total ?? 0} {pagination?.total === 1 ? "pieza" : "piezas"} disponibles
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar filters */}
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            />
          </div>
        </div>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-stone-300" />
                <p className="mt-4 text-sm text-stone-500">{error}</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <Package className="h-7 w-7 text-stone-400" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-stone-900">
                No se encontraron piezas
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                Intenta ajustar los filtros para ver más resultados.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "resultado" : "resultados"}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
