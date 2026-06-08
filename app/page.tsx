import { Gem, Package, Shield, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-stone-100 blur-3xl" />

        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-900 shadow-lg shadow-stone-200/50">
            <Gem className="h-10 w-10 text-amber-400" strokeWidth={1.5} />
          </div>

          <h1 className="font-serif text-5xl font-normal tracking-tight text-stone-900 sm:text-6xl">
            Sistema de Joyería
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-500 leading-relaxed">
            Control exacto del catálogo de piezas. Gestiona inventario, precios y características con precisión.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/productos">
              <Button size="lg" variant="gold" className="group">
                <Package className="mr-2 h-4 w-4" />
                Ver catálogo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/admin/productos">
              <Button size="lg" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Panel Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-6 sm:grid-cols-3">
          <div className="group rounded-2xl border border-stone-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-0.5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg text-stone-900">Catálogo completo</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Gestiona todas tus piezas con detalles específicos: SKU, material, kilataje, peso y más.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-0.5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg text-stone-900">Control de precios</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Registra costos y precios de venta en soles peruanos para un control financiero exacto.
            </p>
          </div>

          <div className="group rounded-2xl border border-stone-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-0.5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg text-stone-900">Acceso seguro</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Solo los administradores pueden registrar nuevas piezas. Vendedores tienen acceso de lectura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
