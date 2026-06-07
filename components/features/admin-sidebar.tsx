"use client";

import { Gem, Package, Tag, Award, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Catálogo", icon: Package },
    { href: "/admin/categorias", label: "Categorías", icon: Tag },
    { href: "/admin/marcas", label: "Marcas", icon: Award },
  ];

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 flex flex-col transition-transform duration-300 ease-in-out",
          "bg-white border-r border-zinc-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 md:w-64"
        )}
      >
        <div className="flex h-20 items-center gap-3 px-6 border-b border-zinc-100">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
            <Gem className="h-5 w-5 text-white" strokeWidth={1.5} />
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-400 border-2 border-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-zinc-900 tracking-tight">Joyería</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Navegación
            </p>
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-emerald-500"
                  />
                )}
                <item.icon className={cn("h-4 w-4", isActive ? "text-emerald-600" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-100 p-4">
          {session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-md">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-600/20"
            >
              Ingresar
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
