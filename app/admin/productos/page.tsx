"use client";

import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/features/product-filters";
import { ProductFormModal } from "@/components/features/product-form-modal";
import { AdminProductCard } from "@/components/features/admin-product-card";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, Package, Loader2, SlidersHorizontal, Search } from "lucide-react";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminProductosPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "administrador";

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
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  useEffect(() => {
    loadProducts();
  }, [filters.tipoJoya, filters.material, filters.categoryId, filters.brandId]);

  const filteredProducts = products.filter((p) => {
    if (filters.search && !p.sku.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Catálogo
            </p>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Piezas
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {pagination?.total ?? 0} {pagination?.total === 1 ? "pieza" : "piezas"} registradas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          {isAdmin && (
            <Button variant="gold" onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva pieza
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por SKU..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-6">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-zinc-300" />
                <p className="mt-4 text-sm text-zinc-500">{error}</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
                <Package className="h-7 w-7 text-zinc-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                No se encontraron piezas
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Intenta ajustar los filtros o registrar una nueva pieza.
              </p>
              {isAdmin && (
                <Button variant="gold" className="mt-4" onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva pieza
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "resultado" : "resultados"}
                </span>
              </div>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} variants={item}>
                    <AdminProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {isAdmin && (
        <ProductFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadProducts}
        />
      )}
    </div>
  );
}
