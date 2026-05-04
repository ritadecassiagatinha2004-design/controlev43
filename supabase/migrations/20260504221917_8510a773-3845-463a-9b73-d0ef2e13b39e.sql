ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Pendente';
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_status_check;
ALTER TABLE public.expenses ADD CONSTRAINT expenses_status_check CHECK (status IN ('Pendente','Pago','Deve'));