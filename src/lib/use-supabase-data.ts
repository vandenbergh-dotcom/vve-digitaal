"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useVvE } from "@/lib/vve-context";

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Hook that fetches data from Supabase, falling back to demo data when not configured.
 * Returns { data, loading, error, mutate, refresh }
 */
export function useSupabaseData<T>(
  table: string,
  demoData: T[],
  options?: {
    select?: string;
    orderBy?: string;
    orderAsc?: boolean;
    filter?: Record<string, unknown>;
  }
): {
  data: T[];
  loading: boolean;
  error: string | null;
  setData: (data: T[] | ((prev: T[]) => T[])) => void;
  refresh: () => Promise<void>;
  insert: (record: Partial<T>) => Promise<T | null>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
} {
  const { currentVvE, isConnected } = useVvE();
  const [data, setData] = useState<T[]>(demoData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isConnected || !isSupabaseConfigured() || !currentVvE) {
      setData(demoData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      let query = supabase
        .from(table)
        .select(options?.select || "*")
        .eq("vve_id", currentVvE.id);

      if (options?.filter) {
        for (const [key, value] of Object.entries(options.filter)) {
          query = query.eq(key, value);
        }
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options?.orderAsc ?? false });
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        console.error(`Error fetching ${table}:`, fetchError);
        setError(fetchError.message);
        setData(demoData); // Fallback to demo
      } else {
        setData((result as T[]) || []);
        setError(null);
      }
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setData(demoData);
    } finally {
      setLoading(false);
    }
  }, [table, currentVvE, isConnected, demoData, options?.select, options?.orderBy, options?.orderAsc, options?.filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = useCallback(async (record: Partial<T>): Promise<T | null> => {
    if (!isConnected || !isSupabaseConfigured() || !currentVvE) {
      // Demo mode: add to local state
      const newRecord = { ...record, id: `demo-${Date.now()}`, vve_id: currentVvE?.id } as T;
      setData((prev) => [...prev, newRecord]);
      return newRecord;
    }

    const supabase = createClient();
    const { data: result, error: insertError } = await supabase
      .from(table)
      .insert({ ...record, vve_id: currentVvE.id })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    setData((prev) => [...prev, result as T]);
    return result as T;
  }, [table, currentVvE, isConnected]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    if (!isConnected || !isSupabaseConfigured()) {
      // Demo mode: update local state
      setData((prev) => prev.map((item) => (item as Record<string, unknown>).id === id ? { ...item, ...updates } : item));
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from(table)
      .update(updates)
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    setData((prev) => prev.map((item) => (item as Record<string, unknown>).id === id ? { ...item, ...updates } : item));
  }, [table, isConnected]);

  const remove = useCallback(async (id: string) => {
    if (!isConnected || !isSupabaseConfigured()) {
      setData((prev) => prev.filter((item) => (item as Record<string, unknown>).id !== id));
      return;
    }

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    setData((prev) => prev.filter((item) => (item as Record<string, unknown>).id !== id));
  }, [table, isConnected]);

  return { data, loading, error, setData, refresh: fetchData, insert, update, remove };
}
