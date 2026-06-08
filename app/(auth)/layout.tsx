import type { ReactNode } from "react";
import { Montserrat_Alternates } from "next/font/google";
import { Toaster } from "@/hooks/use-toast";
import { NextAuthProvider } from "@/components/providers/auth-provider";
import "@/app/globals.css";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={montserratAlternates.variable}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white">
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
