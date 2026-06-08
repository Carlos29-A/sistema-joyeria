"use client";

import { Gem, LogIn, LogOut, Package, Shield, Menu, X, Tag, Award } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "administrador";

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900">
            <Gem className="h-4 w-4 text-amber-400" strokeWidth={1.5} />
          </div>
          <span className="font-serif text-xl text-stone-900">
            Joyería
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/productos" icon={Package}>
            Catálogo
          </NavLink>

          {isAdmin && (
            <>
              <NavLink href="/admin/productos" icon={Shield}>
                Panel Admin
              </NavLink>
              <NavLink href="/admin/categorias" icon={Tag}>
                Categorías
              </NavLink>
              <NavLink href="/admin/marcas" icon={Award}>
                Marcas
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop user */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-600">
                {session.user?.name}
                {isAdmin && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-200/60">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 hover:bg-stone-800 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-stone-600 hover:text-stone-900"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200/80 bg-stone-50 px-4 py-4 space-y-1">
          <MobileNavLink href="/productos" icon={Package} onClick={() => setMobileOpen(false)}>
            Catálogo
          </MobileNavLink>
          {isAdmin && (
            <>
              <MobileNavLink href="/admin/productos" icon={Shield} onClick={() => setMobileOpen(false)}>
                Panel Admin
              </MobileNavLink>
              <MobileNavLink href="/admin/categorias" icon={Tag} onClick={() => setMobileOpen(false)}>
                Categorías
              </MobileNavLink>
              <MobileNavLink href="/admin/marcas" icon={Award} onClick={() => setMobileOpen(false)}>
                Marcas
              </MobileNavLink>
            </>
          )}
          <div className="border-t border-stone-200 pt-2 mt-2">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                <LogIn className="h-4 w-4" />
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
