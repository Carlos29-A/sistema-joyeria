"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Gem, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Credenciales incorrectas");
    } else {
      toast.success("Bienvenido de vuelta");
      router.push("/admin");
      router.refresh();
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50/60 font-sans text-stone-850 selection:bg-amber-100 selection:text-amber-900 p-6">
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl p-8 sm:p-10 shadow-sm relative"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-10 w-10 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mb-3">
            <Gem className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
          </div>
          <span className="font-serif text-xs font-semibold tracking-widest text-amber-800 uppercase mb-1">
            Aurum Joyería
          </span>
          <h1 className="text-xl font-serif text-stone-900 font-medium tracking-tight">
            Acceso al Panel
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block pl-0.5">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
              <Input
                id="email"
                type="email"
                placeholder="admin@joyeria.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 pl-10 pr-4 bg-white border-stone-200 text-stone-900 placeholder:text-stone-300 focus-visible:ring-stone-900/5 focus-visible:border-stone-500 rounded-lg transition-all w-full text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block pl-0.5">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 pl-10 pr-10 bg-white border-stone-200 text-stone-900 placeholder:text-stone-300 focus-visible:ring-stone-900/5 focus-visible:border-stone-500 rounded-lg transition-all w-full text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando...
              </span>
            ) : (
              <span>Ingresar al Sistema</span>
            )}
          </button>
        </form>

        {/* Minimalist Footer */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[9px] font-medium text-stone-400 tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5 text-stone-300" strokeWidth={1.5} />
          <span>CONEXIÓN SEGURA</span>
          <span className="text-stone-200">•</span>
          <span>© {new Date().getFullYear()} AURUM</span>
        </div>
      </motion.div>
      
    </div>
  );
}
