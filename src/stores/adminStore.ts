import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      setIsAdmin: (value: boolean) => set({ isAdmin: value }),
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: "admin-storage",
    }
  )
);
