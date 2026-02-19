import { useState } from "react";
import { UtensilsCrossed, Users, Check, Clock, BarChart3, Calendar, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface RistoranteDemoProps {
  onBookingComplete: () => void;
}

const initialTables = [
  { id: 1, numero: 1, posti: 2, stato: "libero", orario: "", cliente: "" },
  { id: 2, numero: 2, posti: 2, stato: "occupato", orario: "20:00", cliente: "Rossi" },
  { id: 3, numero: 3, posti: 4, stato: "prenotato", orario: "20:30", cliente: "Bianchi" },
  { id: 4, numero: 4, posti: 4, stato: "libero", orario: "", cliente: "" },
  { id: 5, numero: 5, posti: 6, stato: "occupato", orario: "19:30", cliente: "Verdi" },
  { id: 6, numero: 6, posti: 6, stato: "libero", orario: "", cliente: "" },
  { id: 7, numero: 7, posti: 8, stato: "prenotato", orario: "21:00", cliente: "Neri (Compleanno)" },
  { id: 8, numero: 8, posti: 4, stato: "libero", orario: "", cliente: "" },
];

const prenotazioni = [
  { id: 1, orario: "20:00", cliente: "Rossi", posti: 2, tavolo: 2, stato: "arrivato" },
  { id: 2, orario: "20:30", cliente: "Bianchi", posti: 4, tavolo: 3, stato: "confermato" },
  { id: 3, orario: "21:00", cliente: "Neri", posti: 8, tavolo: 7, stato: "confermato" },
  { id: 4, orario: "21:30", cliente: "Costa", posti: 2, tavolo: null, stato: "da assegnare" },
];

const menuItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: UtensilsCrossed, label: "Tavoli" },
  { icon: Calendar, label: "Prenotazioni" },
  { icon: Users, label: "Clienti" },
];

export default function RistoranteDemo({ onBookingComplete }: RistoranteDemoProps) {
  const [tables, setTables] = useState(initialTables);
  const [activeMenu, setActiveMenu] = useState("Tavoli");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({ cliente: "", posti: "2", orario: "20:00" });

  const handleTableClick = (id: number) => {
    const table = tables.find((t) => t.id === id);
    if (table?.stato === "libero") {
      setSelectedTable(id);
    }
  };

  const handleBooking = () => {
    if (!bookingForm.cliente) return;
    
    setTables((prev) =>
      prev.map((t) =>
        t.id === selectedTable
          ? { ...t, stato: "prenotato", cliente: bookingForm.cliente, orario: bookingForm.orario }
          : t
      )
    );
    setSelectedTable(null);
    setShowSuccess(true);
    setBookingForm({ cliente: "", posti: "2", orario: "20:00" });

    setTimeout(() => {
      setShowSuccess(false);
      onBookingComplete();
    }, 2000);
  };

  const getTableColor = (stato: string) => {
    switch (stato) {
      case "libero": return "bg-success/20 border-success/50 hover:bg-success/30";
      case "occupato": return "bg-destructive/20 border-destructive/50";
      case "prenotato": return "bg-yellow-500/20 border-yellow-500/50";
      default: return "bg-muted";
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <span className="font-semibold text-sm">La Pergola</span>
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
            <h3 className="text-lg font-semibold">Mappa Tavoli - Stasera</h3>
            <p className="text-sm text-muted-foreground">Venerdì 10 Gennaio • Ore 20:15</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" /> Libero
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" /> Prenotato
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" /> Occupato
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tables Map */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="grid grid-cols-4 gap-4">
                {tables.map((table) => (
                  <motion.button
                    key={table.id}
                    whileHover={{ scale: table.stato === "libero" ? 1.05 : 1 }}
                    whileTap={{ scale: table.stato === "libero" ? 0.95 : 1 }}
                    onClick={() => handleTableClick(table.id)}
                    className={`aspect-square rounded-xl border-2 p-3 flex flex-col items-center justify-center transition-all ${getTableColor(table.stato)} ${
                      table.stato === "libero" ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span className="text-2xl font-bold">{table.numero}</span>
                    <span className="text-xs text-muted-foreground">{table.posti}p</span>
                    {table.cliente && (
                      <span className="text-xs font-medium mt-1 truncate w-full text-center">
                        {table.cliente}
                      </span>
                    )}
                    {table.orario && (
                      <span className="text-xs text-muted-foreground">{table.orario}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Prenotazioni */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-primary" />
              <h4 className="font-semibold">Prenotazioni Stasera</h4>
            </div>
            <div className="space-y-3">
              {prenotazioni.map((pren) => (
                <div key={pren.id} className="flex items-center justify-between p-2 rounded-lg glass">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{pren.orario}</span>
                    </div>
                    <div className="text-sm">{pren.cliente}</div>
                    <div className="text-xs text-muted-foreground">{pren.posti} persone</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    pren.stato === "arrivato" ? "bg-success/20 text-success" :
                    pren.stato === "confermato" ? "bg-primary/20 text-primary" :
                    "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {pren.tavolo ? `T${pren.tavolo}` : "?"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-success">3</div>
            <div className="text-xs text-muted-foreground">Tavoli Liberi</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">32</div>
            <div className="text-xs text-muted-foreground">Coperti Stasera</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">4</div>
            <div className="text-xs text-muted-foreground">Prenotazioni</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold">€1.2k</div>
            <div className="text-xs text-muted-foreground">Incasso Stimato</div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedTable && (
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
                <UtensilsCrossed size={20} className="text-primary" />
                Prenota Tavolo {tables.find(t => t.id === selectedTable)?.numero}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome Prenotazione</label>
                  <input
                    type="text"
                    value={bookingForm.cliente}
                    onChange={(e) => setBookingForm({ ...bookingForm, cliente: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cognome"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Persone</label>
                    <select
                      value={bookingForm.posti}
                      onChange={(e) => setBookingForm({ ...bookingForm, posti: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {[2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n} className="bg-background">{n} persone</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Orario</label>
                    <select
                      value={bookingForm.orario}
                      onChange={(e) => setBookingForm({ ...bookingForm, orario: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map(t => (
                        <option key={t} value={t} className="bg-background">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setSelectedTable(null)} className="flex-1">
                    Annulla
                  </Button>
                  <Button variant="default" onClick={handleBooking} className="flex-1 btn-glow-blue">
                    Conferma
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
              <h3 className="text-2xl mb-2">Prenotazione Confermata!</h3>
              <p className="text-muted-foreground">Il cliente riceverà una conferma via SMS</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
