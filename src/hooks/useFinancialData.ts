import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

export interface DashboardConfig {
  id: string;
  caixa_atual_value: number;
  caixa_atual_month: string;
  investimento_value: number;
  entrada_mensal_value: number;
  entrada_mensal_month: string;
  filhos_da_casa: number;
}

export interface CashFlowItem {
  id: string;
  month: string;
  value: number;
  display_order: number;
}

export interface Member {
  id: string;
  name: string;
}

export interface Payment {
  id: string;
  member_id: string;
  month: string;
  status: "Pago" | "Pendente";
  year: number;
}

export interface Expense {
  id: string;
  month: string;
  year: number;
  description: string;
  value: number;
}

export interface Income {
  id: string;
  month: string;
  year: number;
  description: string;
  value: number;
}

// Centralized realtime subscription hook - only subscribes once
function useRealtimeSubscription(table: string, queryKey: string[]) {
  const queryClient = useQueryClient();
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const channel = supabase
      .channel(`${table}_changes_${queryKey.join("_")}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [queryClient, table, queryKey.join("_")]);
}

// Dashboard Config Hook
export function useDashboardConfig() {
  useRealtimeSubscription("dashboard_config", ["dashboard_config"]);
  
  return useQuery({
    queryKey: ["dashboard_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboard_config")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data as DashboardConfig | null;
    },
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useUpdateDashboardConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: Partial<DashboardConfig> & { id: string }) => {
      const { id, ...updateData } = config;
      const { error } = await supabase
        .from("dashboard_config")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard_config"] });
    },
  });
}

// Cash Flow Hook
export function useCashFlow() {
  useRealtimeSubscription("cash_flow", ["cash_flow"]);
  
  return useQuery({
    queryKey: ["cash_flow"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_flow")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as CashFlowItem[];
    },
    staleTime: 30000,
  });
}

export function useUpdateCashFlow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Partial<CashFlowItem> & { id: string }) => {
      const { id, ...updateData } = item;
      const { error } = await supabase
        .from("cash_flow")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash_flow"] });
    },
  });
}

export function useAddCashFlow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<CashFlowItem, "id">) => {
      const { error } = await supabase
        .from("cash_flow")
        .insert(item);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash_flow"] });
    },
  });
}

export function useDeleteCashFlow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cash_flow")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash_flow"] });
    },
  });
}

// Members Hook
export function useMembers() {
  useRealtimeSubscription("members", ["members"]);
  
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Member[];
    },
    staleTime: 60000, // Members change less frequently
  });
}

// Payments Hook
export function usePayments(year: number = 2026) {
  useRealtimeSubscription("payments", ["payments", String(year)]);
  
  return useQuery({
    queryKey: ["payments", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("year", year);
      if (error) throw error;
      return data as Payment[];
    },
    staleTime: 30000,
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "Pago" | "Pendente" }) => {
      const { error } = await supabase
        .from("payments")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// Expenses Hook
export function useExpenses(year: number = 2026) {
  useRealtimeSubscription("expenses", ["expenses", String(year)]);
  
  return useQuery({
    queryKey: ["expenses", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("year", year)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Expense[];
    },
    staleTime: 30000,
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: Omit<Expense, "id">) => {
      const { error } = await supabase
        .from("expenses")
        .insert(expense);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: Partial<Expense> & { id: string }) => {
      const { id, ...updateData } = expense;
      const { error } = await supabase
        .from("expenses")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

// Income Hook
export function useIncome(year: number = 2026) {
  useRealtimeSubscription("income", ["income", String(year)]);
  
  return useQuery({
    queryKey: ["income", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income")
        .select("*")
        .eq("year", year)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Income[];
    },
    staleTime: 30000,
  });
}

export function useAddIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (income: Omit<Income, "id">) => {
      const { error } = await supabase
        .from("income")
        .insert(income);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (income: Partial<Income> & { id: string }) => {
      const { id, ...updateData } = income;
      const { error } = await supabase
        .from("income")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("income")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}

// Format currency helper
export const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
