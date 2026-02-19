-- Create monthly budgets table
CREATE TABLE public.monthly_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year TEXT NOT NULL UNIQUE, -- Format: '2025-01'
  original_budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monthly_budgets ENABLE ROW LEVEL SECURITY;

-- Create policies (admin can manage)
CREATE POLICY "Authenticated users can view budgets"
ON public.monthly_budgets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert budgets"
ON public.monthly_budgets
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update budgets"
ON public.monthly_budgets
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete budgets"
ON public.monthly_budgets
FOR DELETE
TO authenticated
USING (true);

-- Add inventory_item_id to expenses table to link expenses to inventory items
ALTER TABLE public.expenses 
ADD COLUMN inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL;

-- Add inventory_category to expenses for category grouping
ALTER TABLE public.expenses
ADD COLUMN inventory_category TEXT;