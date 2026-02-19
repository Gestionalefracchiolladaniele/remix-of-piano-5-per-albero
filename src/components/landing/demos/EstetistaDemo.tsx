import { useState } from "react";
import { Sparkles, Heart, Check, Calendar, BarChart3, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface EstetistaDemoProps {
  onBookingComplete: () => void;
}

const appointments = [
  { id: 1, ora: "9:00", cliente: "Maria G.", trattamento: "Manicure", durata: 45, stato: "confermato" },
  { id: 2, ora: "10:00", cliente: "", trattamento: "", durata: 0, stato: "libero" },
  { id: 3, ora: "11:00", cliente: "Giulia R.", trattamento: "Pulizia Viso", durata: 60, stato: "confermato" },
  { id: 4, ora: "12:00", cliente: "", trattamento: "", durata: 0, stato: "libero" },
  { id: 5, ora: "14:00", cliente: "Laura B.", trattamento: "Massaggio Rilassante", durata: 60, stato: "confermato" },
  { id: 6, ora: "15:00", cliente: "", trattamento: "", durata: 0, stato: "libero" },
  { id: 7, ora: "16:00", cliente: "Francesca M.", trattamento: "Pedicure", durata: 45, stato: "confermato" },
  { id: 8, ora: "17:00", cliente: "", trattamento: "", durata: 0, stato: "libero" },
];

const trattamenti = [
  { nome: "Manicure", durata: 45, prezzo: 25, categoria: "Mani" },
  { nome: "Pedicure", durata: 50, prezzo: 30, categoria: "Piedi" },
  { nome: "Manicure + Pedicure", durata: 90, prezzo: 50, categoria: "Combo" },
  { nome: "Pulizia Viso", durata: 60, prezzo: 45, categoria: "Viso" },
  { nome: "Massaggio Rilassante", durata: 60, prezzo: 55, categoria: "Corpo" },
  { nome: "Ceretta Gambe", durata: 30, prezzo: 25, categoria: "Corpo" },
];

const clienti = [
  { id: 1, nome: "Maria Giuliani", visite: 12, ultimaVisita: "2 Gen", preferenze: "Allergia nichel" },
  { id: 2, nome: "Giulia Rossi", visite: 8, ultimaVisita: "28 Dic", preferenze: "" },
  { id: 3, nome: "Laura Bianchi", visite: 15, ultimaVisita: "5 Gen", preferenze: "Massaggio decontratturante" },
];

const menuItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Calendar, label: "Agenda" },
  { icon: Users, label: "Clienti" },
  { icon: Sparkles, label: "Trattamenti" },
];

export default function EstetistaDemo({ onBookingComplete }: EstetistaDemoProps) {
  const [slots, setSlots] = useState(appointments);
  const [activeMenu, setActiveMenu] = useState("Agenda");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({ 
    cliente: "", 
    telefono: "", 
    trattamento: trattamenti[0].nome,
    note: ""
  });

  const handleSlotClick = (id: number) => {
    const slot = slots.find((a) => a.id === id);
    if (slot?.stato === "libero") {
      setSelectedSlot(id);
    }
  };

  const handleBooking = () => {
    if (!bookingForm.cliente) return;
    
    const selectedTrattamento = trattamenti.find(t => t.nome === bookingForm.trattamento);
    
    setSlots((prev) =>
      prev.map((a) =>
        a.id === selectedSlot
          ? { 
              ...a, 
              stato: "confermato", 
              cliente: bookingForm.cliente, 
              trattamento: bookingForm.trattamento,
              durata: selectedTrattamento?.durata || 45
            }
          : a
      )
    );
    setSelectedSlot(null);
    setShowSuccess(true);
    setBookingForm({ cliente: "", telefono: "", trattamento: trattamenti[0].nome, note: "" });

    setTimeout(() => {
      setShowSuccess(false);
      onBookingComplete();
    }, 2000);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-semibold text-sm">Beauty Elegance</span>
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
            <h3 className="text-lg font-semibold">Agenda Oggi</h3>
            <p className="text-sm text-muted-foreground">Venerdì 10 Gennaio 2026</p>
          </div>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
            <Heart size={16} className="text-pink-500" />
            <span className="text-sm">4 appuntamenti</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agenda */}
          <div className="lg:col-span-2 space-y-2">
            {slots.map((slot) => (
              <motion.button
                key={slot.id}
                whileHover={{ scale: slot.stato === "libero" ? 1.01 : 1 }}
                onClick={() => handleSlotClick(slot.id)}
                disabled={slot.stato !== "libero"}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                  slot.stato === "libero"
                    ? "glass border-2 border-dashed border-pink-500/30 hover:border-pink-500/50 cursor-pointer"
                    : "glass-card"
                }`}
              >
                <div className="text-center min-w-[60px]">
                  <div className="text-lg font-bold">{slot.ora}</div>
                  {slot.durata > 0 && (
                    <div className="text-xs text-muted-foreground">{slot.durata} min</div>
                  )}
                </div>
                
                <div className="h-12 w-px bg-white/10" />
                
                {slot.stato === "libero" ? (
                  <div className="flex-1">
                    <div className="text-pink-500 font-medium">Slot Disponibile</div>
                    <div className="text-xs text-muted-foreground">Clicca per prenotare</div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{slot.cliente}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Sparkles size={12} className="text-pink-500" />
                      {slot.trattamento}
                    </div>
                  </div>
                )}

                {slot.stato === "confermato" && (
                  <div className="px-2 py-1 rounded-full text-xs bg-success/20 text-success">
                    Confermato
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Schede Clienti */}
          <div className="space-y-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-primary" />
                <h4 className="font-semibold">Clienti Frequenti</h4>
              </div>
              <div className="space-y-3">
                {clienti.map((cliente) => (
                  <div key={cliente.id} className="p-3 rounded-lg glass">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{cliente.nome}</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs">{cliente.visite}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ultima visita: {cliente.ultimaVisita}
                    </div>
                    {cliente.preferenze && (
                      <div className="text-xs text-pink-400 mt-1">
                        ⚠️ {cliente.preferenze}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 text-center">
                <div className="text-xl font-bold text-pink-500">€215</div>
                <div className="text-xs text-muted-foreground">Incasso Oggi</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-xl font-bold">4/8</div>
                <div className="text-xs text-muted-foreground">Slot Occupati</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedSlot && (
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
                <Sparkles size={20} className="text-pink-500" />
                Nuovo Appuntamento - {slots.find(s => s.id === selectedSlot)?.ora}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome Cliente</label>
                  <input
                    type="text"
                    value={bookingForm.cliente}
                    onChange={(e) => setBookingForm({ ...bookingForm, cliente: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Maria Rossi"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Telefono</label>
                  <input
                    type="tel"
                    value={bookingForm.telefono}
                    onChange={(e) => setBookingForm({ ...bookingForm, telefono: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="+39 333 123 4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Trattamento</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {trattamenti.map((t) => (
                      <button
                        key={t.nome}
                        onClick={() => setBookingForm({ ...bookingForm, trattamento: t.nome })}
                        className={`p-2 rounded-lg text-left text-xs transition-all ${
                          bookingForm.trattamento === t.nome
                            ? "bg-pink-500 text-white"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        <div className="font-medium truncate">{t.nome}</div>
                        <div className="opacity-70">{t.durata}min • €{t.prezzo}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Note</label>
                  <input
                    type="text"
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Allergie, preferenze..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setSelectedSlot(null)} className="flex-1">
                    Annulla
                  </Button>
                  <Button 
                    onClick={handleBooking} 
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                  >
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
                className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl mb-2">Appuntamento Confermato!</h3>
              <p className="text-muted-foreground">Promemoria inviato alla cliente</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
