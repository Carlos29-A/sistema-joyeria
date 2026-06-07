"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Gem, Lock, Mail, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      router.push("/productos");
      router.refresh();
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-amber-100/50 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-stone-200/50 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 overflow-hidden border border-stone-100">
          <div className="p-10 sm:p-14">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-amber-100 border border-amber-100/50">
                <Gem className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-serif text-stone-800 tracking-tight text-center">
                Acceso al Sistema
              </h1>
              <p className="text-sm text-stone-500 mt-2 font-medium tracking-wide uppercase">
                Panel Administrativo Joyería
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@joyeria.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 bg-stone-50/50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-amber-500/50 focus:ring-amber-500/20 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 bg-stone-50/50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-amber-500/50 focus:ring-amber-500/20 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-base font-medium shadow-lg shadow-amber-600/20 transition-all hover:shadow-xl hover:shadow-amber-600/30 group mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Iniciando sesión..."
                ) : (
                  <span className="flex items-center gap-2">
                    Ingresar al Panel
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          {/* Footer of card */}
          <div className="bg-stone-50 p-6 text-center border-t border-stone-100">
            <p className="text-xs font-medium text-stone-500">
              © {new Date().getFullYear()} Joyería Exclusiva. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
