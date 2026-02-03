import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Prefetch all data on app load for instant navigation
export function usePrefetchData() {
  const queryClient = useQueryClient();
  const prefetchedRef = useRef(false);

  useEffect(() => {
    // Only prefetch once per app lifecycle
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    // Run all prefetches in parallel for faster loading
    Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["dashboard_config"],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("dashboard_config")
            .select("*")
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        staleTime: 60000, // 1 minute
      }),

      queryClient.prefetchQuery({
        queryKey: ["cash_flow"],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("cash_flow")
            .select("*")
            .order("display_order", { ascending: true });
          if (error) throw error;
          return data;
        },
        staleTime: 60000,
      }),

      queryClient.prefetchQuery({
        queryKey: ["members"],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("members")
            .select("*")
            .order("name", { ascending: true });
          if (error) throw error;
          return data;
        },
        staleTime: 120000, // 2 minutes - members change less frequently
      }),

      queryClient.prefetchQuery({
        queryKey: ["payments", 2026],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("year", 2026);
          if (error) throw error;
          return data;
        },
        staleTime: 60000,
      }),

      queryClient.prefetchQuery({
        queryKey: ["expenses", 2026],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("expenses")
            .select("*")
            .eq("year", 2026)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data;
        },
        staleTime: 60000,
      }),

      queryClient.prefetchQuery({
        queryKey: ["income", 2026],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("income")
            .select("*")
            .eq("year", 2026)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data;
        },
        staleTime: 60000,
      }),
    ]);
  }, [queryClient]);
}
