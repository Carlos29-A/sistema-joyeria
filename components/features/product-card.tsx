"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Scale, Gem, Hammer, ArrowRight, Tag, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
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
  oro: "bg-amber-50 text-amber-800 border-amber-200/60",
  plata: "bg-stone-100 text-stone-700 border-stone-200/60",
  platino: "bg-stone-200 text-stone-800 border-stone-300/60",
  acero: "bg-zinc-100 text-zinc-700 border-zinc-200/60",
  otros: "bg-stone-100 text-stone-700 border-stone-200/60",
};

export function ProductCard({ product }: ProductCardProps) {
  const materialClass = materialColor[product.material] || materialColor.otros;
  const firstImage = product.images?.[0]?.url;

  return (
    <Link href={`/productos/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg hover:shadow-stone-900/5"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.sku}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-50">
              <Gem className="h-12 w-12 text-stone-300" strokeWidth={1} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-stone-700 backdrop-blur-sm">
                <Tag className="h-3 w-3" />
                {product.category.name}
              </span>
            )}
            {product.artesanal && (
              <Badge variant="success" className="text-[10px]">
                <Hammer className="mr-1 h-3 w-3" />
                Artesanal
              </Badge>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <Badge variant="danger" className="text-xs">Sin stock</Badge>
            </div>
          )}

          {/* View button on hover */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-stone-900/95 px-4 py-2 text-xs font-medium text-stone-50 backdrop-blur-sm">
              Ver detalle
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* SKU */}
          <p className="font-mono text-[10px] font-medium text-stone-400 tracking-wider">
            {product.sku}
          </p>

          {/* Type and Material */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <h3 className="font-serif text-lg capitalize text-stone-900 truncate">
              {product.tipoJoya}
            </h3>
            <span className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
              materialClass
            )}>
              {product.material}
              {product.kilataje && ` ${product.kilataje}`}
            </span>
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="mt-2 flex items-center gap-1 text-xs text-stone-500">
              <Award className="h-3 w-3 text-amber-600" />
              {product.brand.name}
            </div>
          )}

          {/* Weight */}
          <div className="mt-1.5 flex items-center gap-1 text-xs text-stone-400">
            <Scale className="h-3 w-3" />
            {product.pesoGramos}g
          </div>

          {/* Price and Stock */}
          <div className="mt-3 flex items-end justify-between border-t border-stone-100 pt-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                Precio
              </p>
              <p className="font-serif text-lg text-stone-900">
                S/ {product.precioVenta.toFixed(2)}
              </p>
            </div>
            <span className={cn(
              "text-xs font-medium",
              product.stock > 0 ? "text-emerald-600" : "text-red-500"
            )}>
              {product.stock} {product.stock === 1 ? "und" : "unds"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
