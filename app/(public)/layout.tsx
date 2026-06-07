import type { ReactNode } from "react";
import { Navbar } from "@/components/features/navbar";

export const metadata = {
  title: "Joyería - Catálogo",
  description: "Explora nuestro catálogo de joyas",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
