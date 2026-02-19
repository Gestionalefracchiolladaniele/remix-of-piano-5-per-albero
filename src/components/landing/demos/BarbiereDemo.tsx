import { useState } from "react";
import { Calendar, Clock, Check, Scissors, Users, BarChart3, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BarbiereDemoProps {
  onBookingComplete: () => void;
}

const appointments = [
  { id: 1, day: "Lun", time: "9:00", name: "Mario R.", service: "Taglio + Barba", booked: true },
  { id: 2, day: "Lun", time: "10:00", name: "", service: "", booked: false },
  { id: 3, day: "Lun", time: "11:00", name: "Luca B.", service: "Solo Taglio", booked: true },
  { id: 4, day: "Mar", time: "9:00", name: "", service: "", booked: false },
  { id: 5, day: "Mar", time: "10:00", name: "Giuseppe V.", service: "Barba", booked: true },
  { id: 6, day: "Mar", time: "11:00", name: "", service: "", booked: false },
  { id: 7, day: "Mer", time: "9:00", name: "Paolo S.", service: "Taglio + Barba", booked: true },
  { id: 8, day: "Mer", time: "10:00", name: "", service: "", booked: false },
  { id: 9, day: "Gio", time: "9:00", name: "", service: "", booked: false },
  { id: 10, day: "Gio", time: "10:00", name: "Andrea M.", service: "Solo Taglio", booked: true },
  { id: 11, day: "Ven", time: "9:00", name: "", service: "", booked: false },
  { id: 12, day: "Ven", time: "10:00", name: "Marco T.", service: "Taglio + Barba", booked: true },
  { id: 13, day: "Sab", time: "9:00", name: "Franco G.", service: "Barba", booked: true },
  { id: 14, day: "Sab", time: "10:00", name: "", service: "", booked: false },
];

const services = [
  { name: "Solo Taglio", duration: "30 min", price: "€15" },
  { name: "Solo Barba", duration: "20 min", price: "€10" },
  { name: "Taglio + Barba", duration: "45 min", price: "€22" },
  { name: "Taglio Bambino", duration: "20 min", price: "€12" },
];

const menuItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Calendar, label: "Agenda" },
  { icon: Users, label: "Clienti" },
  { icon: Scissors, label: "Servizi" },
];

export default function BarbiereDemo({ onBookingComplete }: BarbiereDemoProps) {
  const [slots, setSlots] = useState(appointments);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState("Agenda");
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", service: services[0].name });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSlotClick = (id: number) => {
    const slot = slots.find((a) => a.id === id);
    if (!slot?.booked) {
      setSelectedSlot(id);
    }
  };

  const handleBooking = () => {
    if (!bookingForm.name) return;
    
    setSlots((prev) =>
      prev.map((a) =>
        a.id === selectedSlot
          ? { ...a, booked: true, name: bookingForm.name, service: bookingForm.service }
          : a
      )
    );
    setSelectedSlot(null);
    setShowSuccess(true);
    setBookingForm({ name: "", phone: "", service: services[0].name });

    setTimeout(() => {
      setShowSuccess(false);
      onBookingComplete();
    }, 2000);
  };

  const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Scissors size={20} className="text-white" />
          </div>
          <span className="font-semibold text-sm">Barberia Da Mario</span>
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
            <h3 className="text-lg font-semibold">Agenda Settimanale</h3>
            <p className="text-sm text-muted-foreground">Gennaio 2026</p>
          </div>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
            <Bell size={16} className="text-primary" />
            <span className="text-sm">3 promemoria inviati</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {days.map((day) => (
            <div key={day} className="space-y-2">
              <div className="text-center font-semibold text-sm py-2 glass rounded-lg">
                {day}
              </div>
              {slots
                .filter((a) => a.day === day)
                .map((slot) => (
                  <motion.button
                    key={slot.id}
                    whileHover={{ scale: slot.booked ? 1 : 1.02 }}
                    whileTap={{ scale: slot.booked ? 1 : 0.98 }}
                    onClick={() => handleSlotClick(slot.id)}
                    disabled={slot.booked}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      slot.booked
                        ? "glass cursor-default"
                        : "bg-success/10 hover:bg-success/20 cursor-pointer border-2 border-dashed border-success/30"
                    }`}
                  >
                    <div className="text-xs font-medium flex items-center gap-1">
                      <Clock size={12} />
                      {slot.time}
                    </div>
                    {slot.booked ? (
                      <>
                        <div className="text-sm font-semibold mt-1 truncate">
                          {slot.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {slot.service}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-success font-medium mt-1">
                        Disponibile
                      </div>
                    )}
                  </motion.button>
                ))}
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-xs text-muted-foreground">Appuntamenti settimana</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-success">€420</div>
            <div className="text-xs text-muted-foreground">Incasso stimato</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold">87%</div>
            <div className="text-xs text-muted-foreground">Occupazione</div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
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
                <Scissors size={20} className="text-primary" />
                Nuova Prenotazione
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome Cliente</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Telefono</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+39 333 123 4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Servizio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <button
                        key={service.name}
                        onClick={() => setBookingForm({ ...bookingForm, service: service.name })}
                        className={`p-3 rounded-lg text-left transition-all ${
                          bookingForm.service === service.name
                            ? "bg-primary text-primary-foreground"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        <div className="text-sm font-medium">{service.name}</div>
                        <div className="text-xs opacity-70">{service.duration} • {service.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setSelectedSlot(null)} className="flex-1">
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
              <p className="text-muted-foreground">Il cliente riceverà un SMS di promemoria</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
