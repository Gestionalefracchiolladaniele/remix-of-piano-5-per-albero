import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Package, Euro, Plus, Pencil, Trash2, AlertTriangle, 
  ArrowUp, ArrowDown, TrendingDown, TrendingUp, Calendar,
  Wrench, Truck, Users, Zap, MoreHorizontal, StickyNote,
  Calculator, X, Download, History, Filter, BarChart3, Wallet, Settings, Store
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import DistributorManager from "./DistributorManager";
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_stock_level: number;
  cost_per_unit: number;
  notes: string | null;
  created_at: string;
}

interface InventoryMovement {
  id: string;
  item_id: string;
  movement_type: 'in' | 'out';
  quantity: number;
  reason: string | null;
  created_at: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string | null;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category_id: string | null;
  expense_date: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  inventory_item_id: string | null;
  inventory_category: string | null;
  expense_categories?: ExpenseCategory | null;
}

interface MonthlyBudget {
  id: string;
  month_year: string;
  original_budget: number;
  created_at: string;
  updated_at: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'wrench': <Wrench className="w-3 h-3" />,
  'package': <Package className="w-3 h-3" />,
  'truck': <Truck className="w-3 h-3" />,
  'users': <Users className="w-3 h-3" />,
  'zap': <Zap className="w-3 h-3" />,
  'more-horizontal': <MoreHorizontal className="w-3 h-3" />,
};

const defaultInventoryCategories = [
  "Bevande Calde",
  "Bevande Fredde", 
  "Snack",
  "Prodotti Freschi",
  "Ricambi",
  "Materiali Consumo"
];

const CHART_COLORS = ['#2F658B', '#4A90C2', '#6BB3D9', '#8ED1E8', '#B5E5F7', '#D1F0FA'];

export default function InventoryExpenseManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget | null>(null);
  const [allBudgets, setAllBudgets] = useState<MonthlyBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [showMovementHistory, setShowMovementHistory] = useState(false);
  const [showBudgetHistory, setShowBudgetHistory] = useState(false);
  const [showNotesPopover, setShowNotesPopover] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [movementItem, setMovementItem] = useState<InventoryItem | null>(null);
  
  // Notes & Calculator
  const [quickNotes, setQuickNotes] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrevious, setCalcPrevious] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  
  // Unified expense form (includes inventory item creation)
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    notes: '',
    // Inventory fields
    isInventoryItem: false,
    inventoryCategory: '',
    quantity: '',
    unit: 'pz',
    min_stock_level: '',
    cost_per_unit: ''
  });

  const [movementForm, setMovementForm] = useState({
    type: 'in' as 'in' | 'out', quantity: '', reason: ''
  });

  const [budgetForm, setBudgetForm] = useState({
    amount: ''
  });
  
  // Filters
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | '90d' | 'year' | 'all'>('30d');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  // Chart view mode
  const [chartViewMode, setChartViewMode] = useState<'categories' | 'items'>('categories');

  // Get current month in format YYYY-MM
  const getCurrentMonthYear = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchData();
    loadQuickNotes();
  }, []);

  const loadQuickNotes = () => {
    const saved = localStorage.getItem('admin_quick_notes');
    if (saved) setQuickNotes(saved);
  };

  const saveQuickNotes = (notes: string) => {
    setQuickNotes(notes);
    localStorage.setItem('admin_quick_notes', notes);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentMonthYear = getCurrentMonthYear();
      
      const [inventoryRes, movementsRes, expensesRes, categoriesRes, budgetRes, allBudgetsRes] = await Promise.all([
        supabase.from("inventory_items").select("*").order("name"),
        supabase.from("inventory_movements").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("expenses").select("*, expense_categories(*)").order("expense_date", { ascending: false }),
        supabase.from("expense_categories").select("*").order("name"),
        supabase.from("monthly_budgets").select("*").eq("month_year", currentMonthYear).maybeSingle(),
        supabase.from("monthly_budgets").select("*").order("month_year", { ascending: false })
      ]);

      if (inventoryRes.error) throw inventoryRes.error;
      if (movementsRes.error) throw movementsRes.error;
      if (expensesRes.error) throw expensesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (budgetRes.error) throw budgetRes.error;
      if (allBudgetsRes.error) throw allBudgetsRes.error;

      setInventory(inventoryRes.data || []);
      setMovements((movementsRes.data || []).map(m => ({ ...m, movement_type: m.movement_type as 'in' | 'out' })));
      setExpenses((expensesRes.data || []).map(e => ({
        ...e,
        inventory_item_id: (e as any).inventory_item_id || null,
        inventory_category: (e as any).inventory_category || null
      })));
      setCategories(categoriesRes.data || []);
      setMonthlyBudget(budgetRes.data ? { ...budgetRes.data, original_budget: Number(budgetRes.data.original_budget) } : null);
      setAllBudgets((allBudgetsRes.data || []).map(b => ({ ...b, original_budget: Number(b.original_budget) })));
    } catch (error) {
      toast.error("Errore nel caricamento dati");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculator functions
  const handleCalcInput = (value: string) => {
    if (calcDisplay === "0" || calcDisplay === "Errore") {
      setCalcDisplay(value);
    } else {
      setCalcDisplay(calcDisplay + value);
    }
  };

  const handleCalcOperation = (op: string) => {
    setCalcPrevious(parseFloat(calcDisplay));
    setCalcOperation(op);
    setCalcDisplay("0");
  };

  const handleCalcEquals = () => {
    if (calcPrevious === null || !calcOperation) return;
    const current = parseFloat(calcDisplay);
    let result = 0;
    switch (calcOperation) {
      case '+': result = calcPrevious + current; break;
      case '-': result = calcPrevious - current; break;
      case '*': result = calcPrevious * current; break;
      case '/': result = current !== 0 ? calcPrevious / current : NaN; break;
    }
    setCalcDisplay(isNaN(result) ? "Errore" : result.toString());
    setCalcPrevious(null);
    setCalcOperation(null);
  };

  const handleCalcClear = () => {
    setCalcDisplay("0");
    setCalcPrevious(null);
    setCalcOperation(null);
  };

  // Save expense (unified - can also create inventory item)
  const saveExpense = async () => {
    try {
      let inventoryItemId: string | null = null;

      // If it's an inventory item, create it first
      if (expenseForm.isInventoryItem && expenseForm.inventoryCategory) {
        const itemData = {
          name: expenseForm.description,
          category: expenseForm.inventoryCategory,
          quantity: Number(expenseForm.quantity) || 0,
          unit: expenseForm.unit,
          min_stock_level: Number(expenseForm.min_stock_level) || 10,
          cost_per_unit: Number(expenseForm.cost_per_unit) || 0,
          notes: expenseForm.notes || null
        };
        
        const { data: itemResult, error: itemError } = await supabase
          .from("inventory_items")
          .insert(itemData)
          .select()
          .single();
        
        if (itemError) throw itemError;
        inventoryItemId = itemResult.id;
      }

      // Create expense
      const expenseData = {
        description: expenseForm.description,
        amount: Number(expenseForm.amount) || 0,
        category_id: expenseForm.category_id || null,
        expense_date: expenseForm.expense_date,
        payment_method: expenseForm.payment_method || null,
        notes: expenseForm.notes || null,
        inventory_item_id: inventoryItemId,
        inventory_category: expenseForm.isInventoryItem ? expenseForm.inventoryCategory : null
      };
      
      if (editingExpense) {
        const { error } = await supabase
          .from("expenses")
          .update(expenseData)
          .eq("id", editingExpense.id);
        if (error) throw error;
        toast.success("Spesa aggiornata");
      } else {
        const { error } = await supabase
          .from("expenses")
          .insert(expenseData);
        if (error) throw error;
        toast.success(expenseForm.isInventoryItem ? "Articolo e spesa aggiunti" : "Spesa aggiunta");
      }
      setShowExpenseDialog(false);
      setEditingExpense(null);
      resetExpenseForm();
      fetchData();
    } catch (error) {
      toast.error("Errore nel salvataggio");
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Eliminare questa spesa?")) return;
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      toast.success("Spesa eliminata");
      fetchData();
    } catch (error) {
      toast.error("Errore nell'eliminazione");
    }
  };

  const deleteInventoryItem = async (id: string) => {
    if (!confirm("Eliminare questo articolo?")) return;
    try {
      const { error } = await supabase.from("inventory_items").delete().eq("id", id);
      if (error) throw error;
      toast.success("Articolo eliminato");
      fetchData();
    } catch (error) {
      toast.error("Errore nell'eliminazione");
    }
  };

  const saveMovement = async () => {
    if (!movementItem) return;
    const qty = Number(movementForm.quantity) || 0;
    if (qty <= 0) return;
    
    try {
      const { error: movError } = await supabase
        .from("inventory_movements")
        .insert({
          item_id: movementItem.id,
          movement_type: movementForm.type,
          quantity: qty,
          reason: movementForm.reason || null
        });
      if (movError) throw movError;

      const newQty = movementForm.type === 'in' 
        ? movementItem.quantity + qty
        : movementItem.quantity - qty;
      
      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ quantity: Math.max(0, newQty) })
        .eq("id", movementItem.id);
      if (updateError) throw updateError;

      toast.success(movementForm.type === 'in' ? "Carico registrato" : "Scarico registrato");
      setShowMovementDialog(false);
      setMovementItem(null);
      setMovementForm({ type: 'in', quantity: '', reason: '' });
      fetchData();
    } catch (error) {
      toast.error("Errore nel movimento");
    }
  };

  // Budget functions
  const saveBudget = async () => {
    const amount = Number(budgetForm.amount) || 0;
    if (amount <= 0) return;
    
    try {
      const currentMonthYear = getCurrentMonthYear();
      
      if (monthlyBudget) {
        const { error } = await supabase
          .from("monthly_budgets")
          .update({ original_budget: amount })
          .eq("id", monthlyBudget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("monthly_budgets")
          .insert({ month_year: currentMonthYear, original_budget: amount });
        if (error) throw error;
      }
      
      toast.success("Budget salvato");
      setShowBudgetDialog(false);
      setBudgetForm({ amount: '' });
      fetchData();
    } catch (error) {
      toast.error("Errore nel salvataggio budget");
    }
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      description: '',
      amount: '',
      category_id: '',
      expense_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      notes: '',
      isInventoryItem: false,
      inventoryCategory: '',
      quantity: '',
      unit: 'pz',
      min_stock_level: '',
      cost_per_unit: ''
    });
  };

  const openEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: String(expense.amount),
      category_id: expense.category_id || '',
      expense_date: expense.expense_date,
      payment_method: expense.payment_method || '',
      notes: expense.notes || '',
      isInventoryItem: !!expense.inventory_item_id,
      inventoryCategory: expense.inventory_category || '',
      quantity: '',
      unit: 'pz',
      min_stock_level: '',
      cost_per_unit: ''
    });
    setShowExpenseDialog(true);
  };

  // Export CSV
  const exportCSV = () => {
    let csvContent = "Data,Descrizione,Categoria,Tipo Inventario,Importo,Metodo Pagamento\n";
    filteredExpenses.forEach(exp => {
      csvContent += `"${exp.expense_date}","${exp.description}","${exp.expense_categories?.name || ''}","${exp.inventory_category || '-'}",${exp.amount},"${exp.payment_method || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `spese_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Export completato");
  };

  // 3-level stock status
  const getInventoryStatus = (item: InventoryItem) => {
    const qty = item.quantity;
    if (qty <= 10) return { label: 'Critico', color: 'bg-red-500/20 text-red-500 border-red-500/30', level: 'critical' };
    if (qty <= 20) return { label: 'Moderato', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', level: 'moderate' };
    return { label: 'Elevato', color: 'bg-green-500/20 text-green-500 border-green-500/30', level: 'elevated' };
  };

  // Stats calculations
  const criticalStock = inventory.filter(i => i.quantity <= 10).length;
  const moderateStock = inventory.filter(i => i.quantity > 10 && i.quantity <= 20).length;
  const elevatedStock = inventory.filter(i => i.quantity > 20).length;
  
  // Filtered expenses by date
  const getFilteredExpenses = useMemo(() => {
    const now = new Date();
    let filtered = expenses;
    
    // Date filter
    filtered = filtered.filter(e => {
      const expDate = new Date(e.expense_date);
      switch (dateFilter) {
        case '7d':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expDate >= weekAgo;
        case '30d':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return expDate >= monthAgo;
        case '90d':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return expDate >= quarterAgo;
        case 'year':
          return expDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    
    // Category filter
    if (categoryFilter !== 'all') {
      if (defaultInventoryCategories.includes(categoryFilter)) {
        filtered = filtered.filter(e => e.inventory_category === categoryFilter);
      } else {
        filtered = filtered.filter(e => e.category_id === categoryFilter);
      }
    }
    
    return filtered;
  }, [expenses, dateFilter, categoryFilter]);

  const filteredExpenses = getFilteredExpenses;
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Current month expenses for budget
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter(e => {
        const expDate = new Date(e.expense_date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const remainingBudget = monthlyBudget ? monthlyBudget.original_budget - currentMonthExpenses : 0;
  const budgetPercentageUsed = monthlyBudget ? (currentMonthExpenses / monthlyBudget.original_budget) * 100 : 0;

  // Expenses by inventory category
  const expensesByInventoryCategory = useMemo(() => {
    return defaultInventoryCategories.map((cat, idx) => {
      const categoryExpenses = filteredExpenses.filter(exp => exp.inventory_category === cat);
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        name: cat,
        value: total,
        color: CHART_COLORS[idx % CHART_COLORS.length],
        percentage: totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(1) : "0"
      };
    }).filter(c => c.value > 0);
  }, [filteredExpenses, totalExpenses]);

  // Expenses by specific items
  const expensesByItem = useMemo(() => {
    const itemExpenses: Record<string, number> = {};
    
    filteredExpenses.forEach(exp => {
      if (exp.inventory_item_id) {
        const item = inventory.find(i => i.id === exp.inventory_item_id);
        if (item) {
          itemExpenses[item.name] = (itemExpenses[item.name] || 0) + exp.amount;
        }
      } else {
        // Match by description
        const desc = exp.description.toLowerCase();
        inventory.forEach(item => {
          if (desc.includes(item.name.toLowerCase())) {
            itemExpenses[item.name] = (itemExpenses[item.name] || 0) + exp.amount;
          }
        });
      }
    });
    
    return Object.entries(itemExpenses)
      .map(([name, value], idx) => ({
        name,
        value,
        color: CHART_COLORS[idx % CHART_COLORS.length],
        percentage: totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : "0"
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [inventory, filteredExpenses, totalExpenses]);

  // Monthly expenses chart data
  const monthlyExpensesChart = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('it-IT', { month: 'short' });
      months[key] = 0;
    }
    
    expenses.forEach(exp => {
      const expDate = new Date(exp.expense_date);
      const monthsDiff = (now.getFullYear() - expDate.getFullYear()) * 12 + (now.getMonth() - expDate.getMonth());
      if (monthsDiff >= 0 && monthsDiff < 6) {
        const key = expDate.toLocaleDateString('it-IT', { month: 'short' });
        if (months[key] !== undefined) {
          months[key] += exp.amount;
        }
      }
    });
    
    return Object.entries(months).map(([month, amount]) => ({ month, amount }));
  }, [expenses]);

  // Filtered inventory by stock level
  const filteredInventory = useMemo(() => {
    if (stockFilter === 'all') return inventory;
    if (stockFilter === 'critical') return inventory.filter(i => i.quantity <= 10);
    if (stockFilter === 'moderate') return inventory.filter(i => i.quantity > 10 && i.quantity <= 20);
    if (stockFilter === 'elevated') return inventory.filter(i => i.quantity > 20);
    return inventory.filter(i => i.category === stockFilter);
  }, [inventory, stockFilter]);

  const inventoryCategories = [...new Set(inventory.map(i => i.category))];

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case '7d': return '7 giorni';
      case '30d': return '30 giorni';
      case '90d': return '3 mesi';
      case 'year': return 'Anno';
      default: return 'Totale';
    }
  };

  const getCurrentMonthLabel = () => {
    return new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  };

  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  };

  const getExpensesForMonth = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    return expenses
      .filter(e => {
        const expDate = new Date(e.expense_date);
        return expDate.getMonth() + 1 === parseInt(month) && expDate.getFullYear() === parseInt(year);
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="distributors" className="space-y-3">
      <TabsList className="glass h-9 w-full justify-start">
        <TabsTrigger value="distributors" className="data-[state=active]:bg-primary/20 text-xs px-3">
          <Store className="w-3 h-3 mr-1" />
          Distributori
        </TabsTrigger>
        <TabsTrigger value="products" className="data-[state=active]:bg-primary/20 text-xs px-3">
          <Package className="w-3 h-3 mr-1" />
          Prodotti & Spese
        </TabsTrigger>
      </TabsList>

      <TabsContent value="distributors">
        <DistributorManager />
      </TabsContent>

      <TabsContent value="products">
      <div className="space-y-3">
      {/* Header with Quick Tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/20">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm md:text-base font-semibold flex items-center gap-1.5">
            <Euro className="w-4 h-4 text-primary" />
            Gestione Spese
          </h2>
          <div className="flex gap-1 flex-wrap">
            {criticalStock > 0 && (
              <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
                <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                {criticalStock} critici
              </Badge>
            )}
            {moderateStock > 0 && (
              <Badge className="text-[10px] h-4 px-1.5 bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                {moderateStock} moderati
              </Badge>
            )}
            {elevatedStock > 0 && (
              <Badge className="text-[10px] h-4 px-1.5 bg-green-500/20 text-green-600 border-green-500/30">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                {elevatedStock} elevati
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex bg-muted rounded-md p-0.5">
            {(['7d', '30d', '90d', 'year', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-2 py-1 text-[10px] rounded transition-colors ${
                  dateFilter === period 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted-foreground/10'
                }`}
              >
                {period === '7d' ? '7g' : period === '30d' ? '30g' : period === '90d' ? '3m' : period === 'year' ? 'Anno' : 'Tutto'}
              </button>
            ))}
          </div>
          
          <Popover open={showNotesPopover} onOpenChange={setShowNotesPopover}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <StickyNote className="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 glass-card p-2" align="end">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Note Rapide</Label>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setShowNotesPopover(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <Textarea 
                  value={quickNotes}
                  onChange={(e) => saveQuickNotes(e.target.value)}
                  placeholder="Scrivi le tue note..."
                  className="min-h-[100px] text-xs"
                />
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showCalculator} onOpenChange={setShowCalculator}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Calculator className="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 glass-card p-2" align="end">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Calcolatrice</Label>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setShowCalculator(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="bg-muted p-1.5 rounded text-right text-lg font-mono overflow-hidden">
                  {calcDisplay}
                </div>
                <div className="grid grid-cols-4 gap-0.5">
                  {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
                    <Button 
                      key={btn} 
                      variant={['/', '*', '-', '+', '='].includes(btn) ? 'secondary' : 'outline'} 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => {
                        if (btn === '=') handleCalcEquals();
                        else if (['/', '*', '-', '+'].includes(btn)) handleCalcOperation(btn);
                        else handleCalcInput(btn);
                      }}
                    >
                      {btn === '*' ? '×' : btn}
                    </Button>
                  ))}
                  <Button variant="destructive" size="sm" className="h-8 col-span-4 text-xs" onClick={handleCalcClear}>
                    C
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Row with status-bar color background */}
      <div className="bg-status-bar text-status-bar-foreground rounded-lg p-3 -mx-1">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {/* Budget Card */}
          <Card className="bg-white/10 border-white/20 p-2 col-span-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-white/70">Budget {getCurrentMonthLabel()}</p>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-white/10" onClick={() => setShowBudgetHistory(true)}>
                    <History className="w-2.5 h-2.5 text-white/70" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-white">
                    €{monthlyBudget ? monthlyBudget.original_budget.toFixed(0) : '—'}
                  </p>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-white/10" onClick={() => {
                    setBudgetForm({ amount: monthlyBudget ? String(monthlyBudget.original_budget) : '' });
                    setShowBudgetDialog(true);
                  }}>
                    <Settings className="w-3 h-3 text-white/70" />
                  </Button>
                </div>
                {monthlyBudget ? (
                  <div className="mt-1">
                    <div className="flex justify-between text-[9px] text-white/70 mb-0.5">
                      <span>Speso: €{currentMonthExpenses.toFixed(0)}</span>
                      <span className={remainingBudget < 0 ? 'text-red-300' : 'text-green-300'}>
                        Rimasto: €{remainingBudget.toFixed(0)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${budgetPercentageUsed > 100 ? 'bg-red-400' : budgetPercentageUsed > 80 ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ width: `${Math.min(budgetPercentageUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] text-white/50 mt-1">Nessun budget impostato</p>
                )}
              </div>
              <Wallet className="w-5 h-5 text-white/30" />
            </div>
          </Card>

          <Card className={`bg-white/10 border-white/20 p-2 ${criticalStock > 0 ? 'border-red-400/50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">Critici (0-10)</p>
                <p className={`text-lg font-bold ${criticalStock > 0 ? 'text-red-300' : 'text-white'}`}>{criticalStock}</p>
              </div>
              <AlertTriangle className={`w-4 h-4 ${criticalStock > 0 ? 'text-red-400' : 'text-white/30'}`} />
            </div>
          </Card>

          <Card className={`bg-white/10 border-white/20 p-2 ${moderateStock > 0 ? 'border-yellow-400/50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">Moderati (11-20)</p>
                <p className={`text-lg font-bold ${moderateStock > 0 ? 'text-yellow-300' : 'text-white'}`}>{moderateStock}</p>
              </div>
              <TrendingDown className={`w-4 h-4 ${moderateStock > 0 ? 'text-yellow-400' : 'text-white/30'}`} />
            </div>
          </Card>

          <Card className={`bg-white/10 border-white/20 p-2 ${elevatedStock > 0 ? 'border-green-400/50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">Elevati (21+)</p>
                <p className={`text-lg font-bold ${elevatedStock > 0 ? 'text-green-300' : 'text-white'}`}>{elevatedStock}</p>
              </div>
              <TrendingUp className={`w-4 h-4 ${elevatedStock > 0 ? 'text-green-400' : 'text-white/30'}`} />
            </div>
          </Card>
          
          <Card className="bg-white/10 border-white/20 p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">Spese ({getDateFilterLabel()})</p>
                <p className="text-lg font-bold text-white">€{totalExpenses.toFixed(0)}</p>
              </div>
              <Euro className="w-4 h-4 text-white/30" />
            </div>
          </Card>
        </div>
      </div>


      {/* Filters and Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              {defaultInventoryCategories.map(cat => (
                <SelectItem key={cat} value={cat}>📦 {cat}</SelectItem>
              ))}
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-28 h-7 text-xs">
              <SelectValue placeholder="Scorte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              <SelectItem value="critical">🔴 Critici</SelectItem>
              <SelectItem value="moderate">🟡 Moderati</SelectItem>
              <SelectItem value="elevated">🟢 Elevati</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={exportCSV}>
            <Download className="w-3 h-3 mr-1" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowMovementHistory(true)}>
            <History className="w-3 h-3 mr-1" />
            Storico
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={() => { resetExpenseForm(); setEditingExpense(null); setShowExpenseDialog(true); }}>
            <Plus className="w-3 h-3 mr-1" />
            Nuova Spesa
          </Button>
        </div>
      </div>

      {/* Expenses Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-6">
              <Euro className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-xs">Nessuna spesa</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-64">
              <Table>
                <TableHeader>
                  <TableRow className="text-[10px]">
                    <TableHead className="py-1.5">Data</TableHead>
                    <TableHead className="py-1.5">Descrizione</TableHead>
                    <TableHead className="py-1.5">Categoria</TableHead>
                    <TableHead className="py-1.5">Tipo Scorta</TableHead>
                    <TableHead className="py-1.5 text-center">Importo</TableHead>
                    <TableHead className="py-1.5 text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id} className="text-xs">
                      <TableCell className="py-1">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(expense.expense_date).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                        </span>
                      </TableCell>
                      <TableCell className="py-1 font-medium max-w-[150px] truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell className="py-1">
                        {expense.expense_categories && (
                          <Badge variant="outline" className="text-[9px] px-1" style={{ borderColor: expense.expense_categories.color, color: expense.expense_categories.color }}>
                            {expense.expense_categories.icon && categoryIcons[expense.expense_categories.icon]}
                            <span className="ml-0.5">{expense.expense_categories.name}</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-1">
                        {expense.inventory_category && (
                          <Badge variant="secondary" className="text-[9px] px-1">
                            <Package className="w-2.5 h-2.5 mr-0.5" />
                            {expense.inventory_category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-1 text-center font-bold">€{expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="py-1">
                        <div className="flex gap-0.5 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => openEditExpense(expense)} className="h-6 w-6 p-0 hover:bg-primary/20" title="Modifica">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteExpense(expense.id)} className="h-6 w-6 p-0 hover:bg-red-500/20" title="Elimina">
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Items Section */}
      {filteredInventory.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-primary" />
              Articoli in Magazzino ({filteredInventory.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-48">
              <Table>
                <TableHeader>
                  <TableRow className="text-[10px]">
                    <TableHead className="py-1.5">Nome</TableHead>
                    <TableHead className="py-1.5">Categoria</TableHead>
                    <TableHead className="py-1.5 text-center">Qta</TableHead>
                    <TableHead className="py-1.5">Stato</TableHead>
                    <TableHead className="py-1.5 text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getInventoryStatus(item);
                    return (
                      <TableRow key={item.id} className={`text-xs ${item.quantity <= 10 ? "bg-red-500/5" : item.quantity <= 20 ? "bg-yellow-500/5" : ""}`}>
                        <TableCell className="py-1 font-medium">{item.name}</TableCell>
                        <TableCell className="py-1">
                          <Badge variant="secondary" className="text-[9px] px-1">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <span className="font-bold">{item.quantity}</span>
                          <span className="text-muted-foreground text-[9px] ml-0.5">{item.unit}</span>
                        </TableCell>
                        <TableCell className="py-1">
                          <Badge variant="outline" className={`text-[9px] px-1 ${status.color}`}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="py-1">
                          <div className="flex gap-0.5 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => { setMovementItem(item); setMovementForm({ type: 'in', quantity: '', reason: '' }); setShowMovementDialog(true); }} className="h-6 w-6 p-0 hover:bg-green-500/20" title="Carico">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setMovementItem(item); setMovementForm({ type: 'out', quantity: '', reason: '' }); setShowMovementDialog(true); }} className="h-6 w-6 p-0 hover:bg-orange-500/20" title="Scarico">
                              <ArrowDown className="w-3 h-3 text-orange-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteInventoryItem(item.id)} className="h-6 w-6 p-0 hover:bg-red-500/20" title="Elimina">
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-3">
        {/* Pie Chart with toggle */}
        <Card className="glass-card">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                Spese per {chartViewMode === 'categories' ? 'Categoria' : 'Articolo'}
              </CardTitle>
              <div className="flex bg-muted rounded-md p-0.5">
                <button
                  onClick={() => setChartViewMode('categories')}
                  className={`px-2 py-0.5 text-[9px] rounded transition-colors ${
                    chartViewMode === 'categories' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'
                  }`}
                >
                  Vista Categorie
                </button>
                <button
                  onClick={() => setChartViewMode('items')}
                  className={`px-2 py-0.5 text-[9px] rounded transition-colors ${
                    chartViewMode === 'items' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'
                  }`}
                >
                  Vista Articoli
                </button>
              </div>
            </div>
            <CardDescription className="text-[10px]">{getDateFilterLabel()}</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            {(chartViewMode === 'categories' ? expensesByInventoryCategory : expensesByItem).length === 0 ? (
              <div className="text-center py-6">
                <TrendingDown className="w-6 h-6 mx-auto text-muted-foreground/30 mb-1" />
                <p className="text-[10px] text-muted-foreground">Nessun dato</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={chartViewMode === 'categories' ? expensesByInventoryCategory : expensesByItem}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      strokeWidth={2}
                    >
                      {(chartViewMode === 'categories' ? expensesByInventoryCategory : expensesByItem).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="white" />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {(chartViewMode === 'categories' ? expensesByInventoryCategory : expensesByItem).slice(0, 6).map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] px-1 py-0.5 bg-muted/50 rounded">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground truncate max-w-[60px]">{cat.name}</span>
                      </div>
                      <span className="font-medium">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="glass-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Trend Mensile
            </CardTitle>
            <CardDescription className="text-[10px]">Ultimi 6 mesi</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyExpensesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `€${v}`} />
                <Tooltip formatter={(value: number) => [`€${value.toFixed(2)}`, 'Spese']} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Movement History Dialog */}
      <Dialog open={showMovementHistory} onOpenChange={setShowMovementHistory}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4" />
              Storico Movimenti
            </DialogTitle>
            <DialogDescription className="text-xs">Ultimi 50 movimenti</DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto">
            {movements.length === 0 ? (
              <p className="text-center text-muted-foreground text-xs py-4">Nessun movimento</p>
            ) : (
              <div className="space-y-1">
                {movements.slice(0, 50).map((mov) => {
                  const item = inventory.find(i => i.id === mov.item_id);
                  return (
                    <div key={mov.id} className="flex items-center justify-between p-1.5 bg-muted/50 rounded text-xs">
                      <div className="flex items-center gap-1.5">
                        {mov.movement_type === 'in' ? (
                          <ArrowUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-orange-500" />
                        )}
                        <span className="font-medium">{item?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={mov.movement_type === 'in' ? 'text-green-600' : 'text-orange-600'}>
                          {mov.movement_type === 'in' ? '+' : '-'}{mov.quantity}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(mov.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Movement Dialog */}
      <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
        <DialogContent className="glass-card max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">{movementForm.type === 'in' ? 'Carico' : 'Scarico'}</DialogTitle>
            <DialogDescription className="text-xs">{movementItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="flex gap-1">
              <Button variant={movementForm.type === 'in' ? 'default' : 'outline'} onClick={() => setMovementForm({ ...movementForm, type: 'in' })} className="flex-1 h-8 text-xs">
                <ArrowUp className="w-3 h-3 mr-1" />
                Carico
              </Button>
              <Button variant={movementForm.type === 'out' ? 'default' : 'outline'} onClick={() => setMovementForm({ ...movementForm, type: 'out' })} className="flex-1 h-8 text-xs">
                <ArrowDown className="w-3 h-3 mr-1" />
                Scarico
              </Button>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Quantità</Label>
              <Input 
                type="number" 
                value={movementForm.quantity} 
                onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })} 
                placeholder="es. 25" 
                className="h-8 text-sm" 
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Motivo (opz.)</Label>
              <Input value={movementForm.reason} onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })} placeholder="es. Rifornimento" className="h-8 text-sm" />
            </div>
          </div>
          <DialogFooter className="gap-1">
            <Button variant="outline" size="sm" onClick={() => setShowMovementDialog(false)} className="h-8 text-xs">Annulla</Button>
            <Button size="sm" onClick={saveMovement} disabled={!movementForm.quantity || Number(movementForm.quantity) <= 0} className="h-8 text-xs">Conferma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified Expense Dialog (can also add inventory item) */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{editingExpense ? 'Modifica Spesa' : 'Nuova Spesa'}</DialogTitle>
            <DialogDescription className="text-xs">
              {expenseForm.isInventoryItem ? 'Crea anche un articolo in magazzino' : 'Registra una spesa'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {/* Toggle for inventory item */}
            {!editingExpense && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <input 
                  type="checkbox" 
                  id="isInventory" 
                  checked={expenseForm.isInventoryItem}
                  onChange={(e) => setExpenseForm({ ...expenseForm, isInventoryItem: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isInventory" className="text-xs cursor-pointer flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Aggiungi anche come articolo in magazzino
                </Label>
              </div>
            )}

            <div className="grid gap-1">
              <Label className="text-xs">Descrizione / Nome Articolo</Label>
              <Input 
                value={expenseForm.description} 
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} 
                placeholder="es. Caffè Espresso" 
                className="h-8 text-sm" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-xs">Importo €</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={expenseForm.amount} 
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} 
                  placeholder="es. 150.00" 
                  className="h-8 text-sm" 
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Data</Label>
                <Input type="date" value={expenseForm.expense_date} onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })} className="h-8 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-xs">Categoria Spesa</Label>
                <Select value={expenseForm.category_id} onValueChange={(v) => setExpenseForm({ ...expenseForm, category_id: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleziona" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-1">
                          {cat.icon && categoryIcons[cat.icon]}
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Pagamento</Label>
                <Select value={expenseForm.payment_method} onValueChange={(v) => setExpenseForm({ ...expenseForm, payment_method: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleziona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contanti">Contanti</SelectItem>
                    <SelectItem value="carta">Carta</SelectItem>
                    <SelectItem value="bonifico">Bonifico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Inventory specific fields */}
            {expenseForm.isInventoryItem && (
              <>
                <div className="border-t pt-2 mt-1">
                  <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Dettagli Articolo Magazzino
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label className="text-xs">Categoria Inventario</Label>
                    <Select value={expenseForm.inventoryCategory} onValueChange={(v) => setExpenseForm({ ...expenseForm, inventoryCategory: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleziona" /></SelectTrigger>
                      <SelectContent>
                        {defaultInventoryCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Unità</Label>
                    <Select value={expenseForm.unit} onValueChange={(v) => setExpenseForm({ ...expenseForm, unit: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pz">Pezzi</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="lt">Litri</SelectItem>
                        <SelectItem value="conf">Conf.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1">
                    <Label className="text-xs">Quantità</Label>
                    <Input 
                      type="number" 
                      value={expenseForm.quantity} 
                      onChange={(e) => setExpenseForm({ ...expenseForm, quantity: e.target.value })} 
                      placeholder="es. 50" 
                      className="h-8 text-sm" 
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Min Scorta</Label>
                    <Input 
                      type="number" 
                      value={expenseForm.min_stock_level} 
                      onChange={(e) => setExpenseForm({ ...expenseForm, min_stock_level: e.target.value })} 
                      placeholder="es. 10" 
                      className="h-8 text-sm" 
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">€/Unità</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={expenseForm.cost_per_unit} 
                      onChange={(e) => setExpenseForm({ ...expenseForm, cost_per_unit: e.target.value })} 
                      placeholder="es. 0.50" 
                      className="h-8 text-sm" 
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="gap-1">
            <Button variant="outline" size="sm" onClick={() => setShowExpenseDialog(false)} className="h-8 text-xs">Annulla</Button>
            <Button 
              size="sm" 
              onClick={saveExpense} 
              disabled={!expenseForm.description || !expenseForm.amount || Number(expenseForm.amount) <= 0 || (expenseForm.isInventoryItem && !expenseForm.inventoryCategory)} 
              className="h-8 text-xs"
            >
              {expenseForm.isInventoryItem ? 'Salva Spesa + Articolo' : 'Salva Spesa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget Dialog */}
      <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
        <DialogContent className="glass-card max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Budget Mensile
            </DialogTitle>
            <DialogDescription className="text-xs">{getCurrentMonthLabel()}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label className="text-xs">Budget Originale €</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={budgetForm.amount} 
                onChange={(e) => setBudgetForm({ amount: e.target.value })} 
                placeholder="es. 2000.00" 
                className="h-8 text-sm" 
              />
            </div>
            {monthlyBudget && (
              <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                <p>Budget attuale: €{monthlyBudget.original_budget.toFixed(2)}</p>
                <p>Speso questo mese: €{currentMonthExpenses.toFixed(2)}</p>
                <p className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
                  Rimanente: €{remainingBudget.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-1">
            <Button variant="outline" size="sm" onClick={() => setShowBudgetDialog(false)} className="h-8 text-xs">Annulla</Button>
            <Button size="sm" onClick={saveBudget} disabled={!budgetForm.amount || Number(budgetForm.amount) <= 0} className="h-8 text-xs">
              {monthlyBudget ? 'Aggiorna Budget' : 'Imposta Budget'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget History Dialog */}
      <Dialog open={showBudgetHistory} onOpenChange={setShowBudgetHistory}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4" />
              Storico Budget Mensile
            </DialogTitle>
            <DialogDescription className="text-xs">Visualizza tutti i budget passati</DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            {allBudgets.length === 0 ? (
              <div className="text-center py-6">
                <Wallet className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-xs">Nessun budget registrato</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allBudgets.map((budget) => {
                  const spent = getExpensesForMonth(budget.month_year);
                  const remaining = budget.original_budget - spent;
                  const percentageUsed = budget.original_budget > 0 ? (spent / budget.original_budget) * 100 : 0;
                  const isCurrentMonth = budget.month_year === getCurrentMonthYear();
                  
                  return (
                    <div 
                      key={budget.id} 
                      className={`p-3 rounded-lg border ${isCurrentMonth ? 'bg-primary/5 border-primary/30' : 'bg-muted/30 border-border'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium capitalize">
                            {formatMonthYear(budget.month_year)}
                          </span>
                          {isCurrentMonth && (
                            <Badge variant="outline" className="text-[9px] h-4 px-1 border-primary text-primary">
                              Corrente
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div>
                          <p className="text-muted-foreground text-[10px]">Budget</p>
                          <p className="font-semibold">€{budget.original_budget.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Speso</p>
                          <p className="font-semibold text-orange-600">€{spent.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Rimanente</p>
                          <p className={`font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            €{remaining.toFixed(0)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${percentageUsed > 100 ? 'bg-red-500' : percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1 text-right">
                        {percentageUsed.toFixed(0)}% utilizzato
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowBudgetHistory(false)} className="h-8 text-xs">
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
      </TabsContent>
    </Tabs>
  );
}
