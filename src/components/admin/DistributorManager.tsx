import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus, Store, TrendingUp, TrendingDown, DollarSign, Trash2,
  Download, ChevronDown, ChevronUp, MapPin, BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Distributor {
  id: string;
  name: string;
  location: string | null;
  notes: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  distributor_id: string;
  type: string;
  amount: number;
  description: string;
  transaction_date: string;
  notes: string | null;
  created_at: string;
}

type PeriodFilter = "7d" | "30d" | "3m" | "1y" | "all";

const CHART_COLORS = ['#2F658B', '#4A90C2', '#6BB3D9', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c'];

export default function DistributorManager() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("30d");
  const [addDistOpen, setAddDistOpen] = useState(false);
  const [newDist, setNewDist] = useState({ name: "", location: "" });
  const [addTxOpen, setAddTxOpen] = useState<{ distId: string; type: "expense" | "revenue" } | null>(null);
  const [newTx, setNewTx] = useState({ amount: "", description: "", date: new Date().toISOString().split("T")[0] });
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [distRes, txRes] = await Promise.all([
        supabase.from("distributors").select("*").order("created_at", { ascending: false }),
        supabase.from("distributor_transactions").select("*").order("transaction_date", { ascending: false }),
      ]);
      if (distRes.error) throw distRes.error;
      if (txRes.error) throw txRes.error;
      setDistributors((distRes.data as Distributor[]) || []);
      setTransactions((txRes.data as Transaction[]) || []);
    } catch {
      toast.error("Errore nel caricamento");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterDate = () => {
    const now = new Date();
    switch (periodFilter) {
      case "7d": return new Date(now.setDate(now.getDate() - 7));
      case "30d": return new Date(now.setDate(now.getDate() - 30));
      case "3m": return new Date(now.setMonth(now.getMonth() - 3));
      case "1y": return new Date(now.setFullYear(now.getFullYear() - 1));
      default: return null;
    }
  };

  const filteredTransactions = useMemo(() => {
    const filterDate = getFilterDate();
    if (!filterDate) return transactions;
    return transactions.filter(t => new Date(t.transaction_date) >= filterDate);
  }, [transactions, periodFilter]);

  const getTxForDist = (distId: string) => filteredTransactions.filter(t => t.distributor_id === distId);

  const getDistStats = (distId: string) => {
    const txs = getTxForDist(distId);
    const expenses = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const revenue = txs.filter(t => t.type === "revenue").reduce((s, t) => s + Number(t.amount), 0);
    const profit = revenue - expenses;
    const margin = revenue > 0 ? ((profit / revenue) * 100) : 0;
    return { expenses, revenue, profit, margin };
  };

  const totalStats = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const revenue = filteredTransactions.filter(t => t.type === "revenue").reduce((s, t) => s + Number(t.amount), 0);
    return { expenses, revenue, profit: revenue - expenses };
  }, [filteredTransactions]);

  // Chart data: bar chart per distributor
  const barChartData = useMemo(() => {
    return distributors.map(d => {
      const stats = getDistStats(d.id);
      return {
        name: d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name,
        Spese: stats.expenses,
        Guadagni: stats.revenue,
        Profitto: stats.profit,
      };
    });
  }, [distributors, filteredTransactions]);

  // Chart data: pie chart profit distribution
  const pieChartData = useMemo(() => {
    return distributors
      .map((d, idx) => {
        const stats = getDistStats(d.id);
        return {
          name: d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name,
          value: Math.abs(stats.profit),
          color: CHART_COLORS[idx % CHART_COLORS.length],
          isNegative: stats.profit < 0,
        };
      })
      .filter(d => d.value > 0);
  }, [distributors, filteredTransactions]);

  const addDistributor = async () => {
    if (!newDist.name.trim()) return toast.error("Inserisci un nome");
    try {
      const { error } = await supabase.from("distributors").insert({
        name: newDist.name.trim(),
        location: newDist.location.trim() || null,
      });
      if (error) throw error;
      toast.success("Distributore aggiunto");
      setNewDist({ name: "", location: "" });
      setAddDistOpen(false);
      fetchAll();
    } catch {
      toast.error("Errore nell'aggiunta");
    }
  };

  const deleteDistributor = async (id: string) => {
    if (!confirm("Eliminare questo distributore e tutte le sue transazioni?")) return;
    try {
      const { error } = await supabase.from("distributors").delete().eq("id", id);
      if (error) throw error;
      toast.success("Distributore eliminato");
      fetchAll();
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  const addTransaction = async () => {
    if (!addTxOpen || !newTx.amount) return toast.error("Inserisci un importo");
    try {
      const { error } = await supabase.from("distributor_transactions").insert({
        distributor_id: addTxOpen.distId,
        type: addTxOpen.type,
        amount: parseFloat(newTx.amount),
        description: newTx.description.trim(),
        transaction_date: newTx.date,
      });
      if (error) throw error;
      toast.success(addTxOpen.type === "expense" ? "Spesa aggiunta" : "Guadagno aggiunto");
      setNewTx({ amount: "", description: "", date: new Date().toISOString().split("T")[0] });
      setAddTxOpen(null);
      fetchAll();
    } catch {
      toast.error("Errore nell'aggiunta");
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from("distributor_transactions").delete().eq("id", id);
      if (error) throw error;
      toast.success("Transazione eliminata");
      fetchAll();
    } catch {
      toast.error("Errore");
    }
  };

  const exportCSV = () => {
    const rows = filteredTransactions.map(t => {
      const dist = distributors.find(d => d.id === t.distributor_id);
      return `"${dist?.name || ""}","${t.type}","${t.amount}","${t.description}","${t.transaction_date}"`;
    });
    const csv = "Distributore,Tipo,Importo,Descrizione,Data\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transazioni_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const periods: { key: PeriodFilter; label: string }[] = [
    { key: "7d", label: "7g" },
    { key: "30d", label: "30g" },
    { key: "3m", label: "3m" },
    { key: "1y", label: "Anno" },
    { key: "all", label: "Tutto" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {periods.map(p => (
            <Button
              key={p.key}
              variant={periodFilter === p.key ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] px-2"
              onClick={() => setPeriodFilter(p.key)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Button
            variant={showCharts ? "default" : "outline"}
            size="sm"
            className="h-7 text-[10px]"
            onClick={() => setShowCharts(!showCharts)}
          >
            <BarChart3 className="w-3 h-3 mr-1" /> Grafici
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={exportCSV}>
            <Download className="w-3 h-3 mr-1" /> CSV
          </Button>
          <Dialog open={addDistOpen} onOpenChange={setAddDistOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-[10px]">
                <Plus className="w-3 h-3 mr-1" /> Distributore
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-sm">Nuovo Distributore</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Nome *</Label>
                  <Input
                    placeholder="Es. Distributore 1 - Ufficio"
                    value={newDist.name}
                    onChange={e => setNewDist({ ...newDist, name: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Posizione</Label>
                  <Input
                    placeholder="Es. Via Roma 1, Bari"
                    value={newDist.location}
                    onChange={e => setNewDist({ ...newDist, location: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <Button onClick={addDistributor} className="w-full text-xs">Aggiungi</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="p-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Distributori</span>
            <span className="text-lg font-bold">{distributors.length}</span>
            <Store className="w-3.5 h-3.5 text-primary opacity-50 mt-0.5" />
          </div>
        </Card>
        <Card className="p-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Spese Totali</span>
            <span className="text-lg font-bold text-red-500">€{totalStats.expenses.toFixed(2)}</span>
            <TrendingDown className="w-3.5 h-3.5 text-red-500 opacity-50 mt-0.5" />
          </div>
        </Card>
        <Card className="p-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Guadagni Totali</span>
            <span className="text-lg font-bold text-green-500">€{totalStats.revenue.toFixed(2)}</span>
            <TrendingUp className="w-3.5 h-3.5 text-green-500 opacity-50 mt-0.5" />
          </div>
        </Card>
        <Card className="p-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Profitto Netto</span>
            <span className={`text-lg font-bold ${totalStats.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
              €{totalStats.profit.toFixed(2)}
            </span>
            <DollarSign className={`w-3.5 h-3.5 opacity-50 mt-0.5 ${totalStats.profit >= 0 ? "text-green-500" : "text-red-500"}`} />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      {showCharts && distributors.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {/* Bar Chart: Spese vs Guadagni per Distributore */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              Spese vs Guadagni per Distributore
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip
                  formatter={(value: number) => `€${value.toFixed(2)}`}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Spese" fill="#e74c3c" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Guadagni" fill="#27ae60" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart: Distribuzione Profitto */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Distribuzione Profitto per Distributore</h3>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: any) => [
                      `€${value.toFixed(2)} ${props.payload.isNegative ? '(perdita)' : '(profitto)'}`,
                      props.payload.name
                    ]}
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[220px] text-muted-foreground text-xs">
                Nessun dato disponibile
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Distributors List */}
      {distributors.length === 0 ? (
        <Card className="p-6 text-center">
          <Store className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">Nessun distributore. Aggiungine uno!</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {distributors.map(dist => {
            const stats = getDistStats(dist.id);
            const isExpanded = expandedId === dist.id;
            const distTxs = getTxForDist(dist.id);

            return (
              <Card key={dist.id} className="overflow-hidden">
                <div
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : dist.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Store className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{dist.name}</p>
                      {dist.location && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {dist.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="flex gap-3 text-[10px]">
                        <span className="text-red-500">-€{stats.expenses.toFixed(0)}</span>
                        <span className="text-green-500">+€{stats.revenue.toFixed(0)}</span>
                      </div>
                      <p className={`text-xs font-bold ${stats.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        €{stats.profit.toFixed(2)}
                        {stats.revenue > 0 && (
                          <span className="text-[10px] font-normal ml-1">({stats.margin.toFixed(0)}%)</span>
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 sm:hidden ${stats.profit >= 0 ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                    >
                      €{stats.profit.toFixed(0)}
                    </Badge>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t px-3 pb-3 pt-2 space-y-3">
                    <div className="grid grid-cols-3 gap-2 sm:hidden">
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">Spese</p>
                        <p className="text-xs font-bold text-red-500">€{stats.expenses.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">Guadagni</p>
                        <p className="text-xs font-bold text-green-500">€{stats.revenue.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">Margine</p>
                        <p className="text-xs font-bold">{stats.margin.toFixed(0)}%</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px] border-red-500/30 text-red-600 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); setAddTxOpen({ distId: dist.id, type: "expense" }); }}
                      >
                        <TrendingDown className="w-3 h-3 mr-1" /> Spesa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px] border-green-500/30 text-green-600 hover:bg-green-50"
                        onClick={(e) => { e.stopPropagation(); setAddTxOpen({ distId: dist.id, type: "revenue" }); }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" /> Guadagno
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[10px] text-red-500 hover:bg-red-50 ml-auto"
                        onClick={(e) => { e.stopPropagation(); deleteDistributor(dist.id); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {distTxs.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground text-center py-3">Nessuna transazione nel periodo selezionato</p>
                    ) : (
                      <div className="overflow-x-auto max-h-60 overflow-y-auto">
                        <Table className="text-[10px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="py-1">Data</TableHead>
                              <TableHead className="py-1">Tipo</TableHead>
                              <TableHead className="py-1">Importo</TableHead>
                              <TableHead className="py-1">Descrizione</TableHead>
                              <TableHead className="py-1 w-8"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {distTxs.map(tx => (
                              <TableRow key={tx.id}>
                                <TableCell className="py-1 whitespace-nowrap">
                                  {new Date(tx.transaction_date).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                                </TableCell>
                                <TableCell className="py-1">
                                  <Badge
                                    variant="outline"
                                    className={`text-[9px] px-1 py-0 ${tx.type === "expense" ? "border-red-500/30 text-red-500" : "border-green-500/30 text-green-500"}`}
                                  >
                                    {tx.type === "expense" ? "Spesa" : "Guadagno"}
                                  </Badge>
                                </TableCell>
                                <TableCell className={`py-1 font-semibold ${tx.type === "expense" ? "text-red-500" : "text-green-500"}`}>
                                  {tx.type === "expense" ? "-" : "+"}€{Number(tx.amount).toFixed(2)}
                                </TableCell>
                                <TableCell className="py-1 max-w-[120px] truncate">{tx.description || "-"}</TableCell>
                                <TableCell className="py-1">
                                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => deleteTransaction(tx.id)}>
                                    <Trash2 className="w-2.5 h-2.5 text-red-400" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Transaction Dialog */}
      <Dialog open={!!addTxOpen} onOpenChange={(open) => !open && setAddTxOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {addTxOpen?.type === "expense" ? "➖ Aggiungi Spesa" : "➕ Aggiungi Guadagno"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Importo (€) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="150.00"
                value={newTx.amount}
                onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Descrizione</Label>
              <Input
                placeholder="Es. Rifornimento prodotti"
                value={newTx.description}
                onChange={e => setNewTx({ ...newTx, description: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Data</Label>
              <Input
                type="date"
                value={newTx.date}
                onChange={e => setNewTx({ ...newTx, date: e.target.value })}
                className="text-sm"
              />
            </div>
            <Button onClick={addTransaction} className="w-full text-xs">
              {addTxOpen?.type === "expense" ? "Aggiungi Spesa" : "Aggiungi Guadagno"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
