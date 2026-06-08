"use client";

import { api } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

export interface Brand {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: Brand[] }>("/api/marcas");
      setBrands(res.data);
      setError("");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Error al cargar marcas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { brands, loading, error, reload: load };
}
