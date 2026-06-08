"use client";

import { api } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: Category[] }>("/api/categorias");
      setCategories(res.data);
      setError("");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, error, reload: load };
}
