
-- Create distributors table
CREATE TABLE public.distributors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create distributor_transactions table
CREATE TABLE public.distributor_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id UUID NOT NULL REFERENCES public.distributors(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_transactions ENABLE ROW LEVEL SECURITY;

-- RLS for distributors
CREATE POLICY "Admins can view distributors" ON public.distributors FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert distributors" ON public.distributors FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update distributors" ON public.distributors FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete distributors" ON public.distributors FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS for distributor_transactions
CREATE POLICY "Admins can view distributor_transactions" ON public.distributor_transactions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert distributor_transactions" ON public.distributor_transactions FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update distributor_transactions" ON public.distributor_transactions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete distributor_transactions" ON public.distributor_transactions FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on distributors
CREATE TRIGGER update_distributors_updated_at
BEFORE UPDATE ON public.distributors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
