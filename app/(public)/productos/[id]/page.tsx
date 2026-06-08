"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Gem,
  Hammer,
  Loader2,
  AlertTriangle,
  Tag,
  Award,
} from "lucide-react";

interface ProductDetail {
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
  descripcionArtesanal?: string | null;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string; orden: number }[];
  category?: { id: string; name: string };
  brand?: { id: string; name: string } | null;
}

const materialColor: Record<string, string> = {
  oro: "bg-amber-50 text-amber-700 border-amber-200/60",
  plata: "bg-stone-50 text-stone-600 border-stone-200/60",
  platino: "bg-stone-100 text-stone-700 border-stone-300/60",
  acero: "bg-zinc-50 text-zinc-600 border-zinc-200/60",
  otros: "bg-gray-50 text-gray-600 border-gray-200/60",
};

export default function PublicProductoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      try {
        const data = await api.get<ProductDetail>(`/api/productos/${id}`);
        setProduct(data);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-200 bg-white">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-4 font-serif text-lg text-stone-900">Pieza no encontrada</h3>
            <p className="mt-1 text-sm text-stone-500">{error || "La pieza no existe o fue eliminada."}</p>
            <Link href="/productos" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const matClass = materialColor[product.material] || materialColor.otros;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/productos"
          className="inline-flex items-center text-sm text-stone-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Volver al catálogo
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-square overflow-hidden rounded-3xl border border-stone-200/60 bg-stone-50">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.sku}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-50">
                <Gem className="h-16 w-16 text-stone-300" strokeWidth={1} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-xl border-2 transition-all",
                    i === selectedImage
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-stone-200 hover:border-stone-300"
                  )}
                >
                  <img src={img.url} alt={`${product.sku} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-mono text-xs font-medium text-stone-400 tracking-wider">
                {product.sku}
              </span>
              {product.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-200/60">
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
            <h1 className="font-serif text-3xl capitalize text-stone-900">
              {product.tipoJoya}
            </h1>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                matClass
              )}>
                {product.material}
                {product.kilataje && ` ${product.kilataje}`}
              </span>
              {product.brand && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
                  <Award className="h-3.5 w-3.5 text-amber-600" />
                  {product.brand.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-stone-500">
                <Scale className="h-4 w-4" />
                {product.pesoGramos}g
              </span>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 p-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                Precio
              </p>
              <p className="mt-1 font-serif text-2xl text-stone-900">
                S/ {product.precioVenta.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                Stock
              </p>
              <p className={cn(
                "mt-1 text-lg font-medium",
                product.stock > 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {product.stock} {product.stock === 1 ? "unidad" : "unidades"}
              </p>
            </div>
          </div>

          {/* Artisanal description */}
          {product.artesanal && product.descripcionArtesanal && (
            <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-amber-100/30 p-5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-amber-700">
                Proceso artesanal
              </p>
              <p className="mt-2 text-sm text-stone-700 leading-relaxed">
                {product.descripcionArtesanal}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
