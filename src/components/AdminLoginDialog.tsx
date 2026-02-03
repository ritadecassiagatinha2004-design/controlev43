import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVerifyAdminPassword } from "@/hooks/useFinancialData";
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const [password, setPassword] = useState("");
  const verifyPassword = useVerifyAdminPassword();
  const setIsAdmin = useAdminStore((state) => state.setIsAdmin);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = await verifyPassword.mutateAsync(password);
      
      if (isValid) {
        setIsAdmin(true);
        onOpenChange(false);
        setPassword("");
        toast({
          title: "Acesso autorizado",
          description: "Você entrou na área de administração",
        });
      } else {
        toast({
          title: "Senha incorreta",
          description: "Por favor, tente novamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível verificar a senha",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Acesso Administrativo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Digite a senha de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={verifyPassword.isPending}>
              {verifyPassword.isPending ? "Verificando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
