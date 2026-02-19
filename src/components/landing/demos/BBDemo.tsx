import { useState } from "react";
import { BedDouble, Users, Check, Calendar, BarChart3, Star, Home, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BBDemoProps {
  onBookingComplete: () => void;
}

const camere = [
  { id: 1, nome: "Camera Standard", prezzo: 80, stato: "libera", checkin: "", checkout: "", ospite: "" },
  { id: 2, nome: "Camera Deluxe", prezzo: 120, stato: "occupata", checkin: "8 Gen", checkout: "12 Gen", ospite: "Rossi Marco" },
  { id: 3, nome: "Suite Panoramica", prezzo: 180, stato: "occupata", checkin: "10 Gen", checkout: "15 Gen", ospite: "Bianchi Luigi" },
  { id: 4, nome: "Camera Matrimoniale", prezzo: 90, stato: "prenotata", checkin: "14 Gen", checkout: "16 Gen", ospite: "Verdi Anna" },
  { id: 5, nome: "Camera Singola", prezzo: 60, stato: "libera", checkin: "", checkout: "", ospite: "" },
];

const prenotazioni = [
  { id: 1, ospite: "Rossi Marco", camera: "Camera Deluxe", checkin: "8 Gen", checkout: "12 Gen", stato: "in-house" },
  { id: 2, ospite: "Bianchi Luigi", camera: "Suite Panoramica", checkin: "10 Gen", checkout: "15 Gen", stato: "in-house" },
  { id: 3, ospite: "Verdi Anna", camera: "Camera Matrimoniale", checkin: "14 Gen", checkout: "16 Gen", stato: "confermata" },
  { id: 4, ospite: "Costa Paolo", camera: "Camera Standard", checkin: "18 Gen", checkout: "20 Gen", stato: "in attesa" },
];

const menuItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: BedDouble, label: "Camere" },
  { icon: Calendar, label: "Calendario" },
  { icon: Users, label: "Ospiti" },
];

export default function BBDemo({ onBookingComplete }: BBDemoProps) {
  const [rooms, setRooms] = useState(camere);
  const [activeMenu, setActiveMenu] = useState("Camere");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({ 
    nome: "", 
    email: "", 
    telefono: "", 
    checkin: "2026-01-20", 
    checkout: "2026-01-22" 
  });

  const handleRoomClick = (id: number) => {
    const room = rooms.find((r) => r.id === id);
    if (room?.stato === "libera") {
      setSelectedRoom(id);
    }
  };

  const handleBooking = () => {
    if (!bookingForm.nome) return;
    
    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom
          ? { ...r, stato: "prenotata", ospite: bookingForm.nome, checkin: "20 Gen", checkout: "22 Gen" }
          : r
      )
    );
    setSelectedRoom(null);
    setShowSuccess(true);
    setBookingForm({ nome: "", email: "", telefono: "", checkin: "2026-01-20", checkout: "2026-01-22" });

    setTimeout(() => {
      setShowSuccess(false);
      onBookingComplete();
    }, 2000);
  };

  const getStatoStyle = (stato: string) => {
    switch (stato) {
      case "libera": return "bg-success/20 border-success/50 text-success";
      case "occupata": return "bg-destructive/20 border-destructive/50 text-destructive";
      case "prenotata": return "bg-yellow-500/20 border-yellow-500/50 text-yellow-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Home size={20} className="text-white" />
          </div>
          <span className="font-semibold text-sm">Villa Aurora</span>
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
        
        {/* Quick Stats */}
        <div className="mt-6 p-3 glass rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">4.8</span>
            <span className="text-xs text-muted-foreground">(127 recensioni)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Gestione Camere</h3>
            <p className="text-sm text-muted-foreground">Gennaio 2026</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success" /> Libera</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Prenotata</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive" /> Occupata</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rooms List */}
          <div className="lg:col-span-2 space-y-3">
            {rooms.map((camera) => (
              <motion.div
                key={camera.id}
                whileHover={{ scale: camera.stato === "libera" ? 1.01 : 1 }}
                onClick={() => handleRoomClick(camera.id)}
                className={`glass-card p-4 transition-all ${
                  camera.stato === "libera" ? "cursor-pointer hover:ring-2 hover:ring-success/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass rounded-lg flex items-center justify-center">
                      <BedDouble size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{camera.nome}</h4>
                      <p className="text-sm text-muted-foreground">€{camera.prezzo}/notte</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatoStyle(camera.stato)}`}>
                      {camera.stato.charAt(0).toUpperCase() + camera.stato.slice(1)}
                    </span>
                    {camera.ospite && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {camera.ospite} • {camera.checkin} → {camera.checkout}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Prenotazioni */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-primary" />
              <h4 className="font-semibold">Prossimi Arrivi/Partenze</h4>
            </div>
            <div className="space-y-3">
              {prenotazioni.map((pren) => (
                <div key={pren.id} className="p-3 rounded-lg glass">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{pren.ospite}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      pren.stato === "in-house" ? "bg-success/20 text-success" :
                      pren.stato === "confermata" ? "bg-primary/20 text-primary" :
                      "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {pren.stato}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{pren.camera}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pren.checkin} → {pren.checkout}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-success">2</div>
            <div className="text-xs text-muted-foreground">Camere Libere</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">60%</div>
            <div className="text-xs text-muted-foreground">Occupazione</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold">€2.4k</div>
            <div className="text-xs text-muted-foreground">Incasso Mese</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">3</div>
            <div className="text-xs text-muted-foreground">Check-out Settimana</div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedRoom && (
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
                <BedDouble size={20} className="text-primary" />
                Prenota {rooms.find(r => r.id === selectedRoom)?.nome}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome Ospite</label>
                  <input
                    type="text"
                    value={bookingForm.nome}
                    onChange={(e) => setBookingForm({ ...bookingForm, nome: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nome e Cognome"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                      <Mail size={12} /> Email
                    </label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="email@..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                      <Phone size={12} /> Telefono
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.telefono}
                      onChange={(e) => setBookingForm({ ...bookingForm, telefono: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+39..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Check-in</label>
                    <input
                      type="date"
                      value={bookingForm.checkin}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkin: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Check-out</label>
                    <input
                      type="date"
                      value={bookingForm.checkout}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkout: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="p-3 glass rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>2 notti × €{rooms.find(r => r.id === selectedRoom)?.prezzo}</span>
                    <span className="font-bold">€{(rooms.find(r => r.id === selectedRoom)?.prezzo || 0) * 2}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setSelectedRoom(null)} className="flex-1">
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
              <p className="text-muted-foreground">Istruzioni check-in inviate via email</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
