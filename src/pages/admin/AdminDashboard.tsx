import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  LogOut, Users, MessageSquare, Eye, Check, X, Clock, 
  Trash2, Settings, Send, Package
} from "lucide-react";
import logo from "@/assets/logo-top-quality.png";
import PWAInstallPrompt from "@/components/admin/PWAInstallPrompt";
import NotificationPromptDialog from "@/components/admin/NotificationPromptDialog";
import InventoryExpenseManager from "@/components/admin/InventoryExpenseManager";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initDashboard = async () => {
      await checkAuth();
      await fetchData();
    };
    initDashboard();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
      return;
    }
    const { data: roleData } = await supabase
      .rpc('has_role', { _role: 'admin', _user_id: session.user.id });
    if (!roleData) {
      await supabase.auth.signOut();
      navigate("/admin");
      toast.error("Accesso negato");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setContacts(data || []);
    } catch {
      toast.error("Errore nel caricamento dati");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success("Stato aggiornato");
      fetchData();
    } catch {
      toast.error("Errore nell'aggiornamento");
    }
  };

  const deleteContactRequest = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa richiesta?")) return;
    try {
      const { error } = await supabase
        .from("contact_requests")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Richiesta eliminata");
      fetchData();
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-[10px] px-1.5 py-0"><Clock className="w-2.5 h-2.5 mr-0.5" /> Attesa</Badge>;
      case "contacted":
        return <Badge variant="outline" className="border-blue-500 text-blue-500 text-[10px] px-1.5 py-0"><Eye className="w-2.5 h-2.5 mr-0.5" /> Contattato</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-green-500 text-green-500 text-[10px] px-1.5 py-0"><Check className="w-2.5 h-2.5 mr-0.5" /> Completato</Badge>;
      case "rejected":
        return <Badge variant="outline" className="border-red-500 text-red-500 text-[10px] px-1.5 py-0"><X className="w-2.5 h-2.5 mr-0.5" /> Rifiutato</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0">{status}</Badge>;
    }
  };

  const stats = {
    totalContacts: contacts.length,
    pendingContacts: contacts.filter(c => c.status === "pending" || c.status === "new").length,
    completedContacts: contacts.filter(c => c.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <NotificationPromptDialog />
      
      <header className="bg-status-bar text-status-bar-foreground sticky top-0 z-50">
        <div className="section-container flex items-center justify-between h-12 md:h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-7 md:h-8 w-auto" />
            <span className="font-bold text-sm md:text-base">Admin Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-xs text-status-bar-foreground hover:bg-white/10">
            <LogOut className="w-3 h-3 mr-1.5" />
            Esci
          </Button>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      </header>

      <main className="section-container py-4 md:py-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
          <Card className="glass-card p-2 md:p-3">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-muted-foreground">Totali</span>
              <span className="text-lg md:text-xl font-bold">{stats.totalContacts}</span>
              <Users className="w-4 h-4 text-primary opacity-50 mt-0.5" />
            </div>
          </Card>
          <Card className="glass-card p-2 md:p-3 border-yellow-500/30">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-muted-foreground">Attesa</span>
              <span className="text-lg md:text-xl font-bold text-yellow-500">{stats.pendingContacts}</span>
              <Clock className="w-4 h-4 text-yellow-500 opacity-50 mt-0.5" />
            </div>
          </Card>
          <Card className="glass-card p-2 md:p-3 border-green-500/30">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-muted-foreground">Completate</span>
              <span className="text-lg md:text-xl font-bold text-green-500">{stats.completedContacts}</span>
              <Check className="w-4 h-4 text-green-500 opacity-50 mt-0.5" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="contacts" className="space-y-3">
          <TabsList className="glass h-9">
            <TabsTrigger value="contacts" className="data-[state=active]:bg-primary/20 text-xs px-2 md:px-3">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Richieste</span>
              {stats.pendingContacts > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {stats.pendingContacts}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-primary/20 text-xs px-2 md:px-3">
              <Package className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Gestione</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20 text-xs px-2 md:px-3">
              <Settings className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Impostazioni</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card className="glass-card">
              <CardHeader className="py-3 px-3 md:px-4">
                <CardTitle className="flex items-center gap-1.5 text-sm md:text-base">
                  <MessageSquare className="w-4 h-4" />
                  Richieste di Contatto
                </CardTitle>
                <CardDescription className="text-xs">
                  Gestisci le richieste • {stats.pendingContacts} in attesa
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 md:p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">Nessuna richiesta ricevuta</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="py-2">Data</TableHead>
                          <TableHead className="py-2">Nome</TableHead>
                          <TableHead className="py-2">Contatti</TableHead>
                          <TableHead className="py-2">Attività</TableHead>
                          <TableHead className="py-2">Note</TableHead>
                          <TableHead className="py-2">Stato</TableHead>
                          <TableHead className="text-right py-2">Azioni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact) => (
                          <TableRow key={contact.id} className={contact.status === "pending" || contact.status === "new" ? "bg-yellow-500/5" : ""}>
                            <TableCell className="py-1.5 text-muted-foreground whitespace-nowrap">
                              {new Date(contact.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                            </TableCell>
                            <TableCell className="py-1.5 font-medium">{contact.name}</TableCell>
                            <TableCell className="py-1.5">
                              <div className="flex flex-col">
                                <span>{contact.email}</span>
                                {contact.phone && <span className="text-[10px] text-muted-foreground">{contact.phone}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="py-1.5">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{contact.business_type}</Badge>
                            </TableCell>
                            <TableCell className="py-1.5 max-w-[150px]">
                              {contact.message ? (
                                <p className="text-[10px] text-muted-foreground truncate" title={contact.message}>{contact.message}</p>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/50">-</span>
                              )}
                            </TableCell>
                            <TableCell className="py-1.5">{getStatusBadge(contact.status)}</TableCell>
                            <TableCell className="py-1.5">
                              <div className="flex gap-0.5 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => updateContactStatus(contact.id, "contacted")} className="h-6 w-6 p-0 hover:bg-blue-500/20" title="Segna come contattato">
                                  <Send className="w-3 h-3 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => updateContactStatus(contact.id, "completed")} className="h-6 w-6 p-0 hover:bg-green-500/20" title="Segna come completato">
                                  <Check className="w-3 h-3 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => updateContactStatus(contact.id, "rejected")} className="h-6 w-6 p-0 hover:bg-red-500/20" title="Segna come rifiutato">
                                  <X className="w-3 h-3 text-red-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteContactRequest(contact.id)} className="h-6 w-6 p-0 hover:bg-red-500/20" title="Elimina richiesta">
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
          </TabsContent>

          <TabsContent value="management">
            <InventoryExpenseManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <PWAInstallPrompt />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
