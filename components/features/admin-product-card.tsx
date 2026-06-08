"use client";

import { cn } from "@/lib/utils";
import { Scale, Gem, Hammer, Tag, Award, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AdminProductCardProps {
  product: {
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
  };
}

const materialColor: Record<string, string> = {
  oro: "bg-amber-50 text-amber-700 border-amber-200",
  plata: "bg-zinc-100 text-zinc-700 border-zinc-200",
  platino: "bg-zinc-200 text-zinc-800 border-zinc-300",
  acero: "bg-zinc-100 text-zinc-700 border-zinc-200",
  otros: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function AdminProductCard({ product }: AdminProductCardProps) {
  const materialClass = materialColor[product.material] || materialColor.otros;
  const firstImage = product.images?.[0]?.url;
  const margen = product.precioVenta - product.costo;
  const margenPct = product.costo > 0 ? ((margen / product.costo) * 100).toFixed(0) : "0";
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/productos/${product.id}`}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.sku}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50">
              <Gem className="h-12 w-12 text-zinc-300" strokeWidth={1} />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-zinc-700 backdrop-blur-sm border border-zinc-200">
                <Tag className="h-3 w-3 text-emerald-600" />
                {product.category.name}
              </span>
            )}
            {product.artesanal && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                <Hammer className="h-3 w-3" />
                Artesanal
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                Sin stock
              </span>
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200">
                <AlertTriangle className="h-3 w-3" />
                Stock bajo
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] font-medium text-zinc-400 tracking-wider">
              {product.sku}
            </p>
            <span className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
              materialClass
            )}>
              {product.material}
              {product.kilataje && ` ${product.kilataje}`}
            </span>
          </div>

          <h3 className="mt-2 font-semibold text-base text-zinc-900 capitalize truncate">
            {product.tipoJoya}
          </h3>

          {product.brand && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500">
              <Award className="h-3 w-3 text-amber-600" />
              {product.brand.name}
            </div>
          )}

          <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500">
            <Scale className="h-3 w-3" />
            {product.pesoGramos}g
          </div>

          <div className="mt-3 rounded-xl bg-zinc-50 border border-zinc-100 p-3 space-y-2">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                  Precio venta
                </p>
                <p className="font-bold text-base text-zinc-900">
                  S/ {product.precioVenta.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                  Costo
                </p>
                <p className="text-sm text-zinc-600">
                  S/ {product.costo.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-200">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-medium text-zinc-500">Margen:</span>
              <span className="text-xs font-bold text-emerald-700">
                S/ {margen.toFixed(2)} ({margenPct}%)
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className={cn(
              "text-xs font-semibold",
              isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-emerald-600"
            )}>
              {product.stock} {product.stock === 1 ? "unidad" : "unidades"}
            </span>
            <span className="text-[10px] text-zinc-400">
              en inventario
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
