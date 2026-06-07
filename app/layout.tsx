import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/hooks/use-toast";
import { NextAuthProvider } from "@/components/providers/auth-provider";
import "@/app/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Sistema de Joyería",
  description: "Control exacto del catálogo de joyería",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900 min-h-screen">
        <NextAuthProvider>
          {children}
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
