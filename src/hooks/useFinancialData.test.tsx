import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdatePayment } from "./useFinancialData";

const db = vi.hoisted(() => ({ from: vi.fn(), insert: vi.fn(), update: vi.fn(), eq: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: db.from } }));

function setup() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { ...renderHook(() => useUpdatePayment(), { wrapper }), invalidate };
}

describe("saving member payments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.from.mockReturnValue({ insert: db.insert, update: db.update });
    db.update.mockReturnValue({ eq: db.eq });
    db.insert.mockResolvedValue({ error: null });
    db.eq.mockResolvedValue({ error: null });
  });

  it.each(["Pago", "Deve", "Pendente"] as const)("creates a missing payment with status %s", async (status) => {
    const { result, invalidate } = setup();
    const input = { member_id: "new-member", month: "Outubro", year: 2026, status };
    await act(async () => { await result.current.mutateAsync(input); });
    expect(db.from).toHaveBeenCalledWith("payments");
    expect(db.insert).toHaveBeenCalledWith(input);
    expect(db.update).not.toHaveBeenCalled();
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["payments"] }));
  });

  it("updates an existing payment instead of inserting another", async () => {
    const { result } = setup();
    await act(async () => {
      await result.current.mutateAsync({ id: "payment-id", member_id: "member", month: "Outubro", year: 2026, status: "Deve" });
    });
    expect(db.update).toHaveBeenCalledWith({ status: "Deve" });
    expect(db.eq).toHaveBeenCalledWith("id", "payment-id");
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("reports failed inserts without announcing success", async () => {
    const error = new Error("Write denied");
    db.insert.mockResolvedValue({ error });
    const { result, invalidate } = setup();
    await act(async () => {
      await expect(result.current.mutateAsync({ member_id: "member", month: "Outubro", year: 2026, status: "Pago" })).rejects.toThrow("Write denied");
    });
    expect(invalidate).not.toHaveBeenCalled();
  });
});