import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Prefetch all data on app load for instant navigation
export function usePrefetchData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch dashboard config
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
      staleTime: 30000,
    });

    // Prefetch cash flow
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
      staleTime: 30000,
    });

    // Prefetch members
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
      staleTime: 60000,
    });

    // Prefetch payments
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
      staleTime: 30000,
    });

    // Prefetch expenses
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
      staleTime: 30000,
    });

    // Prefetch income
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
      staleTime: 30000,
    });
  }, [queryClient]);
}
