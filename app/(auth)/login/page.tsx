"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Gem, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, ShieldAlert } from "lucide-react";
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

  // Animation variants
  const pageContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/20 selection:text-amber-200 overflow-hidden relative">
      
      {/* Background decoration for mobile */}
      <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[20%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-amber-500/5 blur-[80px]" />
        <div className="absolute -bottom-[20%] -left-[20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-zinc-800/10 blur-[80px]" />
      </div>

      {/* Left Column: Visual Showcase (Hidden on Mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden lg:flex lg:col-span-7 xl:col-span-8 flex-col justify-between p-12 overflow-hidden border-r border-zinc-900/60"
      >
        {/* Background Image with Ken Burns Effect */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/luxury_jewelry.png"
            alt="Luxury Jewelry Showcase"
            className="w-full h-full object-cover transition-transform duration-[12000ms] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-zinc-950/15" />
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[1px]" />
        </div>

        {/* Top: Logo & Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25"
          >
            <Gem className="h-5 w-5 text-zinc-950" strokeWidth={2} />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-serif text-lg font-semibold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent uppercase"
          >
            Aurum Joyería
          </motion.span>
        </div>

        {/* Middle: Content/Slogan */}
        <div className="relative z-10 max-w-lg mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
              <Sparkles className="h-3 w-3" />
              Colección Exclusiva
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl xl:text-5xl font-serif text-white leading-tight font-light mb-6"
          >
            La distinción está en los <span className="italic text-amber-400 font-normal">detalles</span> más finos.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-zinc-400 text-sm leading-relaxed"
          >
            Acceda al panel de control para gestionar el catálogo de piezas exclusivas, controlar el inventario de gemas, metales preciosos y administrar las marcas de mayor prestigio en el mercado.
          </motion.p>
        </div>

        {/* Bottom: Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative z-10 flex items-center justify-between border-t border-zinc-900/60 pt-6"
        >
          <p className="text-[11px] text-zinc-500 font-medium">
            © {new Date().getFullYear()} Aurum Joyería Premium. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-[11px] text-zinc-400 font-medium">
            <span>Soporte Privado</span>
            <span className="text-zinc-800">|</span>
            <span>v2.0</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Column: Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-center p-6 sm:p-12 z-10 bg-zinc-950/80 backdrop-blur-md lg:bg-zinc-950"
      >
        {/* Ambient glows for the card on desktop */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none hidden lg:block" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none hidden lg:block" />

        <div className="w-full max-w-md">
          {/* Mobile brand logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20">
              <Gem className="h-4.5 w-4.5 text-zinc-950" strokeWidth={2} />
            </div>
            <span className="font-serif text-base font-semibold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent uppercase">
              Aurum
            </span>
          </div>

          {/* Glassmorphic Login Card */}
          <motion.div
            variants={pageContainer}
            initial="hidden"
            animate="show"
            className="w-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Elegant top shiny border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />

            {/* Header */}
            <motion.div variants={fadeUpItem} className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 10 }}
                className="h-12 w-12 bg-zinc-900/90 border border-zinc-800 rounded-xl flex items-center justify-center mb-4 shadow-lg relative group"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Gem className="h-5.5 w-5.5 text-amber-400 group-hover:text-amber-300 transition-colors" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-xl font-serif text-zinc-100 tracking-tight text-center font-semibold">
                Acceso al Sistema
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 text-center">
                Portal de Administración de Joyería
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={fadeUpItem} className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block pl-0.5">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@joyeria.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-11 pr-4 bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 rounded-xl transition-all w-full text-sm"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUpItem} className="space-y-2">
                <div className="flex justify-between items-center pl-0.5">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Contraseña
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-11 pr-11 bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 rounded-xl transition-all w-full text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" strokeWidth={1.5} /> : <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeUpItem} className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/10 transition-all hover:shadow-xl hover:shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-zinc-900">
                      <svg className="animate-spin h-4 w-4 text-zinc-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verificando...
                    </span>
                  ) : (
                    <>
                      <span>Ingresar al Panel</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Secure access info footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium tracking-wide"
          >
            <ShieldAlert className="h-4 w-4 text-amber-500/50" />
            <span>CONEXIÓN CIFRADA DE ALTA SEGURIDAD</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
