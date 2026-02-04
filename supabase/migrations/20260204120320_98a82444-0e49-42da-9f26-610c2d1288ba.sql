-- Remove as políticas permissivas de escrita e cria novas que exigem admin

-- CASH_FLOW
DROP POLICY IF EXISTS "Escrita pública cash_flow" ON public.cash_flow;
CREATE POLICY "Admins can modify cash_flow"
ON public.cash_flow
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DASHBOARD_CONFIG
DROP POLICY IF EXISTS "Escrita pública dashboard_config" ON public.dashboard_config;
CREATE POLICY "Admins can modify dashboard_config"
ON public.dashboard_config
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- EXPENSES
DROP POLICY IF EXISTS "Escrita pública expenses" ON public.expenses;
CREATE POLICY "Admins can modify expenses"
ON public.expenses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- INCOME
DROP POLICY IF EXISTS "Escrita pública income" ON public.income;
CREATE POLICY "Admins can modify income"
ON public.income
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- MEMBERS
DROP POLICY IF EXISTS "Escrita pública members" ON public.members;
CREATE POLICY "Admins can modify members"
ON public.members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PAYMENTS
DROP POLICY IF EXISTS "Escrita pública payments" ON public.payments;
CREATE POLICY "Admins can modify payments"
ON public.payments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));