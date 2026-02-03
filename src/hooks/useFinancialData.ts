import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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

// Dashboard Config Hook
export function useDashboardConfig() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["dashboard_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboard_config")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data as DashboardConfig | null;
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("dashboard_config_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard_config" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["dashboard_config"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
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
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["cash_flow"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_flow")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as CashFlowItem[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("cash_flow_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cash_flow" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["cash_flow"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
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
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Member[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("members_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["members"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

// Payments Hook
export function usePayments(year: number = 2026) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["payments", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("year", year);
      if (error) throw error;
      return data as Payment[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("payments_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["payments"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
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
  const queryClient = useQueryClient();
  
  const query = useQuery({
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
  });

  useEffect(() => {
    const channel = supabase
      .channel("expenses_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["expenses"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
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
  const queryClient = useQueryClient();
  
  const query = useQuery({
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
  });

  useEffect(() => {
    const channel = supabase
      .channel("income_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "income" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["income"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
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

// Admin Settings Hook
export function useVerifyAdminPassword() {
  return useMutation({
    mutationFn: async (password: string) => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("admin_password")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Configuração de admin não encontrada");
      return data.admin_password === password;
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
