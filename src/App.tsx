import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePrefetchData } from "@/hooks/usePrefetchData";
import Index from "./pages/Index";
import Mensalidades from "./pages/Mensalidades";
import Gastos from "./pages/Gastos";
import Entradas from "./pages/Entradas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

const App = () => (
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

export default App;
