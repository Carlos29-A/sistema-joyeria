import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/features/admin-sidebar";

export const metadata = {
  title: "Panel Admin - Joyería",
  description: "Panel de administración del catálogo de joyería",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 overflow-auto">{children}</main>
    </div>
  );
}
