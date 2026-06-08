import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "emerald" | "success" | "danger" | "gold";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-zinc-900 text-white",
    secondary: "bg-zinc-100 text-zinc-700 border border-zinc-200",
    outline: "border border-zinc-300 text-zinc-700",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    gold: "bg-amber-50 text-amber-700 border border-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
