"use client";

import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Package, Tag, Award, TrendingUp, Loader2, ArrowUpRight, Gem, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

interface RecentProduct {
  id: string;
  sku: string;
  tipoJoya: string;
  material: string;
  precioVenta: number;
  stock: number;
  images: { url: string }[];
  category?: { name: string };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "administrador";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          api.get<{ data: RecentProduct[]; pagination: { total: number } }>("/api/productos", { page: "1", limit: "5" }),
          api.get<{ data: { id: string }[] }>("/api/categorias"),
          api.get<{ data: { id: string }[] }>("/api/marcas"),
        ]);

        const products = productsRes.data;
        const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
        const outOfStock = products.filter((p) => p.stock === 0).length;
        const totalValue = products.reduce((sum, p) => sum + p.precioVenta * p.stock, 0);

        setStats({
          totalProducts: productsRes.pagination.total,
          totalCategories: categoriesRes.data.length,
          totalBrands: brandsRes.data.length,
          lowStock,
          outOfStock,
          totalValue,
        });
        setRecentProducts(products);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message || "Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500">{error}</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Piezas totales",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "from-emerald-500 to-emerald-700",
      shadow: "shadow-emerald-500/20",
      href: "/admin/productos",
    },
    {
      label: "Categorías",
      value: stats?.totalCategories ?? 0,
      icon: Tag,
      color: "from-amber-500 to-amber-700",
      shadow: "shadow-amber-500/20",
      href: "/admin/categorias",
    },
    {
      label: "Marcas",
      value: stats?.totalBrands ?? 0,
      icon: Award,
      color: "from-violet-500 to-violet-700",
      shadow: "shadow-violet-500/20",
      href: "/admin/marcas",
    },
    {
      label: "Valor inventario",
      value: `S/ ${(stats?.totalValue ?? 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "from-cyan-500 to-cyan-700",
      shadow: "shadow-cyan-500/20",
      href: "/admin/productos",
    },
  ];

  const alertCards = [
    {
      label: "Stock bajo",
      value: stats?.lowStock ?? 0,
      description: "piezas con ≤ 3 unidades",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      label: "Sin stock",
      value: stats?.outOfStock ?? 0,
      description: "piezas agotadas",
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Dashboard
          </p>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Bienvenido, {session?.user?.name?.split(" ")[0] || "Administrador"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Resumen general del catálogo de joyería
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8"
      >
        {kpiCards.map((kpi) => (
          <motion.div key={kpi.label} variants={item}>
            <Link href={kpi.href}>
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {kpi.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-zinc-900">
                      {kpi.value}
                    </p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg ${kpi.shadow}`}>
                    <kpi.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {alertCards.map((alert) => (
          <div
            key={alert.label}
            className={`rounded-2xl border p-5 ${alert.bg}`}
          >
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold ${alert.color}`}>
                {alert.value}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{alert.label}</p>
                <p className="text-xs text-zinc-500">{alert.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white border border-zinc-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <Gem className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-zinc-900">Piezas recientes</h2>
          </div>
          <Link
            href="/admin/productos"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <Package className="mx-auto h-10 w-10 text-zinc-300" />
              <p className="mt-3 text-sm text-zinc-500">No hay piezas registradas</p>
              {isAdmin && (
                <Link
                  href="/admin/productos"
                  className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Registrar primera pieza →
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/productos/${product.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.sku}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Gem className="h-5 w-5 text-zinc-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[10px] text-zinc-500">{product.sku}</p>
                    {product.stock === 0 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                        Agotado
                      </span>
                    )}
                    {product.stock > 0 && product.stock <= 3 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                        Stock bajo
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 capitalize truncate">
                    {product.tipoJoya}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {product.material}
                    {product.category && ` · ${product.category.name}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-zinc-900">
                    S/ {product.precioVenta.toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {product.stock} und
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
