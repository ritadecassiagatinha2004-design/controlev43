import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePrefetchData } from "@/hooks/usePrefetchData";
import { useState } from "react";
import Index from "./pages/Index";
import Mensalidades from "./pages/Mensalidades";
import Gastos from "./pages/Gastos";
import Entradas from "./pages/Entradas";
import NotFound from "./pages/NotFound";

// Component that prefetches data on mount
function AppContent() {
  usePrefetchData();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/mensalidades" element={<Mensalidades />} />
      <Route path="/gastos" element={<Gastos />} />
      <Route path="/entradas" element={<Entradas />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  // Create the QueryClient inside the component so defaultOptions reliably apply
  // after HMR/refresh, and so queries don't get stuck in a paused state.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: "always",
            staleTime: 60000, // 1 minute - reduce refetches
            gcTime: 600000, // 10 minutes - keep data in cache longer
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Don't refetch if data exists
            retry: 1,
          },
          mutations: {
            networkMode: "always",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
