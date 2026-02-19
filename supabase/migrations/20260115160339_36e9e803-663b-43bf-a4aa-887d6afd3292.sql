-- Create expense categories table
CREATE TABLE public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory items table
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pz',
  min_stock_level NUMERIC NOT NULL DEFAULT 10,
  cost_per_unit NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory movements table
CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out')),
  quantity NUMERIC NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS policies for expense_categories (admin only)
CREATE POLICY "Admins can view expense categories" ON public.expense_categories
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert expense categories" ON public.expense_categories
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update expense categories" ON public.expense_categories
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete expense categories" ON public.expense_categories
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS policies for inventory_items (admin only)
CREATE POLICY "Admins can view inventory items" ON public.inventory_items
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert inventory items" ON public.inventory_items
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inventory items" ON public.inventory_items
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inventory items" ON public.inventory_items
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS policies for inventory_movements (admin only)
CREATE POLICY "Admins can view inventory movements" ON public.inventory_movements
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert inventory movements" ON public.inventory_movements
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inventory movements" ON public.inventory_movements
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS policies for expenses (admin only)
CREATE POLICY "Admins can view expenses" ON public.expenses
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert expenses" ON public.expenses
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update expenses" ON public.expenses
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete expenses" ON public.expenses
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Trigger for updating inventory_items.updated_at
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default expense categories
INSERT INTO public.expense_categories (name, color, icon) VALUES
  ('Manutenzione', '#ef4444', 'wrench'),
  ('Prodotti', '#22c55e', 'package'),
  ('Trasporto', '#3b82f6', 'truck'),
  ('Personale', '#f59e0b', 'users'),
  ('Utenze', '#8b5cf6', 'zap'),
  ('Altro', '#6b7280', 'more-horizontal');