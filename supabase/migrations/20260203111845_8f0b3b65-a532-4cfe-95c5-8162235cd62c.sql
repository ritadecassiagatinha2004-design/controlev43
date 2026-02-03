-- Tabela de configurações do dashboard
CREATE TABLE public.dashboard_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caixa_atual_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  caixa_atual_month TEXT NOT NULL DEFAULT 'Fevereiro',
  investimento_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  entrada_mensal_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  entrada_mensal_month TEXT NOT NULL DEFAULT 'Fevereiro',
  filhos_da_casa INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de fluxo de caixa mensal
CREATE TABLE public.cash_flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de membros
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pagamentos mensais
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pago', 'Pendente')),
  year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_id, month, year)
);

-- Tabela de gastos mensais
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2026,
  description TEXT NOT NULL,
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de entradas mensais
CREATE TABLE public.income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2026,
  description TEXT NOT NULL,
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de senha de admin (simples)
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_password TEXT NOT NULL DEFAULT '88410205',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.dashboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (todos podem ver os dados)
CREATE POLICY "Leitura pública dashboard_config" ON public.dashboard_config FOR SELECT USING (true);
CREATE POLICY "Leitura pública cash_flow" ON public.cash_flow FOR SELECT USING (true);
CREATE POLICY "Leitura pública members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Leitura pública payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Leitura pública expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Leitura pública income" ON public.income FOR SELECT USING (true);

-- Políticas de escrita pública (para permitir edição via admin - simplificado)
CREATE POLICY "Escrita pública dashboard_config" ON public.dashboard_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública cash_flow" ON public.cash_flow FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública income" ON public.income FOR ALL USING (true) WITH CHECK (true);

-- Somente leitura para verificar senha
CREATE POLICY "Leitura admin_settings" ON public.admin_settings FOR SELECT USING (true);

-- Habilitar Realtime para todas as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.dashboard_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cash_flow;
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.income;

-- Inserir dados iniciais do dashboard
INSERT INTO public.dashboard_config (caixa_atual_value, caixa_atual_month, investimento_value, entrada_mensal_value, entrada_mensal_month, filhos_da_casa)
VALUES (157.90, 'Fevereiro', 5716.35, 0.00, 'Fevereiro', 12);

-- Inserir dados do caixa mensal
INSERT INTO public.cash_flow (month, value, display_order) VALUES
('Fevereiro', 157.90, 1),
('Janeiro', 836.15, 2);

-- Inserir membros
INSERT INTO public.members (name) VALUES
('ADRIANA'), ('BRUNO'), ('CAFU'), ('CAROL'), ('CELIA'), ('ELAINE'),
('FATIMA'), ('JESSICA'), ('LAZARO'), ('LETICIA'), ('RAYSSA'), ('SYNCLAIR');

-- Inserir senha de admin
INSERT INTO public.admin_settings (admin_password) VALUES ('88410205');