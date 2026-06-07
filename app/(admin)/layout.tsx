import type { ReactNode } from "react";
import { Montserrat_Alternates } from "next/font/google";
import { AdminSidebar } from "@/components/features/admin-sidebar";
import { Toaster } from "@/hooks/use-toast";
import { NextAuthProvider } from "@/components/providers/auth-provider";
import "@/app/globals.css";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Panel Admin - Joyería",
  description: "Panel de administración del catálogo de joyería",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={montserratAlternates.variable}>
      <body className="font-sans antialiased bg-zinc-50 text-zinc-900">
        <NextAuthProvider>
          <div className="flex min-h-screen">
            <main className="flex-1 min-w-0">{children}</main>
            <AdminSidebar />
          </div>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "font-sans",
            }}
          />
        </NextAuthProvider>
      </body>
    </html>
  );
}
