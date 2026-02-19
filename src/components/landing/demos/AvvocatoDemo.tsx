import { useState } from "react";
import { FileText, Calendar, Check, Briefcase, Users, BarChart3, Bell, AlertTriangle, Clock, Folder, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AvvocatoDemoProps {
  onBookingComplete: () => void;
}

const pratiche = [
  { id: 1, numero: "P-2026-001", cliente: "Rossi Mario", tipo: "Civile", stato: "In corso", scadenza: "15 Gen", urgente: true },
  { id: 2, numero: "P-2026-002", cliente: "Bianchi S.r.l.", tipo: "Societario", stato: "In attesa", scadenza: "22 Gen", urgente: false },
  { id: 3, numero: "P-2025-089", cliente: "Verdi Anna", tipo: "Famiglia", stato: "In corso", scadenza: "18 Gen", urgente: true },
  { id: 4, numero: "P-2025-076", cliente: "Neri Giuseppe", tipo: "Penale", stato: "Chiusa", scadenza: "-", urgente: false },
  { id: 5, numero: "P-2026-003", cliente: "Costa Laura", tipo: "Lavoro", stato: "Nuova", scadenza: "30 Gen", urgente: false },
];

const scadenze = [
  { id: 1, data: "Oggi", evento: "Udienza Tribunale Milano", pratica: "P-2026-001", tipo: "udienza" },
  { id: 2, data: "Domani", evento: "Deposito Memoria", pratica: "P-2025-089", tipo: "deposito" },
  { id: 3, data: "15 Gen", evento: "Scadenza Termini", pratica: "P-2026-001", tipo: "scadenza" },
  { id: 4, data: "18 Gen", evento: "Mediazione", pratica: "P-2025-089", tipo: "mediazione" },
];

const menuItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Folder, label: "Pratiche" },
  { icon: Calendar, label: "Scadenze" },
  { icon: Users, label: "Clienti" },
];

export default function AvvocatoDemo({ onBookingComplete }: AvvocatoDemoProps) {
  const [activeMenu, setActiveMenu] = useState("Pratiche");
  const [selectedPratica, setSelectedPratica] = useState<number | null>(null);
  const [showNewPratica, setShowNewPratica] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newPraticaForm, setNewPraticaForm] = useState({ cliente: "", tipo: "Civile", descrizione: "" });

  const handleCreatePratica = () => {
    if (!newPraticaForm.cliente) return;
    setShowNewPratica(false);
    setShowSuccess(true);
    setNewPraticaForm({ cliente: "", tipo: "Civile", descrizione: "" });

    setTimeout(() => {
      setShowSuccess(false);
      onBookingComplete();
    }, 2000);
  };

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case "In corso": return "bg-primary/20 text-primary";
      case "In attesa": return "bg-yellow-500/20 text-yellow-500";
      case "Chiusa": return "bg-muted text-muted-foreground";
      case "Nuova": return "bg-success/20 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
            <Scale size={20} className="text-white" />
          </div>
          <span className="font-semibold text-sm">Studio Rossi</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeMenu === item.label
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Gestione Pratiche</h3>
            <p className="text-sm text-muted-foreground">5 pratiche attive</p>
          </div>
          <Button onClick={() => setShowNewPratica(true)} className="btn-glow-blue">
            + Nuova Pratica
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pratiche List */}
          <div className="lg:col-span-2 space-y-3">
            {pratiche.map((pratica) => (
              <motion.div
                key={pratica.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedPratica(pratica.id)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedPratica === pratica.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pratica.numero}</span>
                        {pratica.urgente && (
                          <AlertTriangle size={14} className="text-destructive" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{pratica.cliente}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatoColor(pratica.stato)}`}>
                      {pratica.stato}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">{pratica.tipo}</div>
                  </div>
                </div>
                {pratica.scadenza !== "-" && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Clock size={12} />
                    Prossima scadenza: {pratica.scadenza}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Scadenziario */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-primary" />
              <h4 className="font-semibold">Scadenziario</h4>
            </div>
            <div className="space-y-3">
              {scadenze.map((scadenza) => (
                <div key={scadenza.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    scadenza.data === "Oggi" ? "bg-destructive" : 
                    scadenza.data === "Domani" ? "bg-yellow-500" : "bg-primary"
                  }`} />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">{scadenza.data}</div>
                    <div className="text-sm font-medium">{scadenza.evento}</div>
                    <div className="text-xs text-muted-foreground">{scadenza.pratica}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-xs text-muted-foreground">Pratiche Attive</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-destructive">2</div>
            <div className="text-xs text-muted-foreground">Urgenti</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">4</div>
            <div className="text-xs text-muted-foreground">Scadenze Mese</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-success">12</div>
            <div className="text-xs text-muted-foreground">Chiuse 2025</div>
          </div>
        </div>
      </div>

      {/* New Pratica Modal */}
      <AnimatePresence>
        {showNewPratica && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-20"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h3 className="mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-primary" />
                Nuova Pratica
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Cliente</label>
                  <input
                    type="text"
                    value={newPraticaForm.cliente}
                    onChange={(e) => setNewPraticaForm({ ...newPraticaForm, cliente: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nome cliente"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo</label>
                  <select
                    value={newPraticaForm.tipo}
                    onChange={(e) => setNewPraticaForm({ ...newPraticaForm, tipo: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Civile" className="bg-background">Civile</option>
                    <option value="Penale" className="bg-background">Penale</option>
                    <option value="Lavoro" className="bg-background">Lavoro</option>
                    <option value="Famiglia" className="bg-background">Famiglia</option>
                    <option value="Societario" className="bg-background">Societario</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Descrizione</label>
                  <textarea
                    value={newPraticaForm.descrizione}
                    onChange={(e) => setNewPraticaForm({ ...newPraticaForm, descrizione: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                    placeholder="Breve descrizione della pratica..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowNewPratica(false)} className="flex-1">
                    Annulla
                  </Button>
                  <Button variant="default" onClick={handleCreatePratica} className="flex-1 btn-glow-blue">
                    Crea Pratica
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-background/95 flex items-center justify-center z-20"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check size={40} className="text-success-foreground" />
              </motion.div>
              <h3 className="text-2xl mb-2">Pratica Creata!</h3>
              <p className="text-muted-foreground">Numero: P-2026-004</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
