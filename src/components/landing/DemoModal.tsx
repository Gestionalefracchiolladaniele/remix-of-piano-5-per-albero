import { useState, useEffect } from "react";
import { X, Calendar, Scissors, Briefcase, UtensilsCrossed, Home, Sparkles, ArrowRight, FileText, Bell, Star, BedDouble, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// Import demo components
import BarbiereDemo from "./demos/BarbiereDemo";
import AvvocatoDemo from "./demos/AvvocatoDemo";
import RistoranteDemo from "./demos/RistoranteDemo";
import BBDemo from "./demos/BBDemo";
import EstetistaDemo from "./demos/EstetistaDemo";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoType: string;
}

// Demo configurations for each business type
const demoConfigs = {
  barbiere: {
    name: "Barberia Da Mario",
    icon: Scissors,
    color: "from-blue-500 to-blue-600",
    tagline: "Prenotazioni online 24/7",
    description: "Un sistema completo per gestire la tua barberia: appuntamenti, clienti e incassi in un'unica piattaforma.",
    features: [
      { icon: Calendar, text: "Calendario prenotazioni smart" },
      { icon: Bell, text: "Promemoria WhatsApp automatici" },
      { icon: FileText, text: "Storico tagli per cliente" },
      { icon: Star, text: "Report incassi giornalieri" },
    ],
    Component: BarbiereDemo,
  },
  avvocato: {
    name: "Studio Legale Rossi",
    icon: Briefcase,
    color: "from-slate-500 to-slate-600",
    tagline: "Gestione pratiche semplificata",
    description: "Organizza pratiche, scadenze e appuntamenti. Mai più una scadenza dimenticata con il nostro scadenziario automatico.",
    features: [
      { icon: FileText, text: "Archivio pratiche digitale" },
      { icon: Bell, text: "Scadenziario con notifiche" },
      { icon: Calendar, text: "Calendario udienze" },
      { icon: Star, text: "Report ore lavorate" },
    ],
    Component: AvvocatoDemo,
  },
  ristorante: {
    name: "Ristorante La Pergola",
    icon: UtensilsCrossed,
    color: "from-red-500 to-red-600",
    tagline: "Gestione tavoli in tempo reale",
    description: "Visualizza la mappa tavoli in tempo reale, gestisci prenotazioni e tieni traccia dei coperti.",
    features: [
      { icon: UtensilsCrossed, text: "Mappa tavoli interattiva" },
      { icon: Calendar, text: "Prenotazioni con conferma SMS" },
      { icon: Bell, text: "Storico clienti e preferenze" },
      { icon: Star, text: "Report coperti e incassi" },
    ],
    Component: RistoranteDemo,
  },
  bb: {
    name: "B&B Villa Aurora",
    icon: Home,
    color: "from-green-500 to-green-600",
    tagline: "Check-in online automatizzato",
    description: "Gestisci camere, prenotazioni e check-in da un'unica dashboard. Istruzioni automatiche agli ospiti.",
    features: [
      { icon: BedDouble, text: "Calendario disponibilità camere" },
      { icon: Calendar, text: "Prenotazioni con pagamento" },
      { icon: Bell, text: "Check-in online automatico" },
      { icon: Star, text: "Gestione recensioni" },
    ],
    Component: BBDemo,
  },
  estetista: {
    name: "Beauty Center Elegance",
    icon: Sparkles,
    color: "from-pink-500 to-pink-600",
    tagline: "Prenota il tuo trattamento",
    description: "Agenda smart con schede cliente personali. Tieni traccia di preferenze, allergie e storico trattamenti.",
    features: [
      { icon: Calendar, text: "Agenda appuntamenti smart" },
      { icon: Heart, text: "Schede trattamento clienti" },
      { icon: Bell, text: "Promemoria automatici" },
      { icon: Star, text: "Report trattamenti e incassi" },
    ],
    Component: EstetistaDemo,
  },
};

export default function DemoModal({ isOpen, onClose, demoType }: DemoModalProps) {
  const [showLanding, setShowLanding] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const config = demoConfigs[demoType as keyof typeof demoConfigs] || demoConfigs.barbiere;

  // Reset state when modal opens/closes or demoType changes
  useEffect(() => {
    if (isOpen) {
      setShowLanding(true);
      setShowCTA(false);
    }
  }, [isOpen, demoType]);

  const handleClose = () => {
    setShowLanding(true);
    setShowCTA(false);
    onClose();
  };

  const handleBookingComplete = async () => {
    try {
      await supabase.from("demo_analytics").insert({
        demo_type: demoType,
        action: "booking_completed"
      });
      
      // Send push notification to admins
      await supabase.functions.invoke("send-push-notification", {
        body: {
          payload: {
            title: "🎮 Demo Completata!",
            body: `Qualcuno ha completato la demo ${config.name}`,
            url: "/admin/dashboard"
          }
        }
      });
    } catch (e) {
      console.log("Analytics tracking failed");
    }
    setShowCTA(true);
  };

  const scrollToContact = () => {
    handleClose();
    setTimeout(() => {
      document.querySelector("#contatti")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const DemoIcon = config.icon;
  const DemoComponent = config.Component;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="relative w-full max-w-5xl max-h-[90vh] glass-card overflow-hidden"
          >
            {/* Landing Page View */}
            <AnimatePresence mode="wait">
              {showLanding ? (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 md:p-12"
                >
                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 glass rounded-lg hover:bg-white/10 transition-colors z-10"
                  >
                    <X size={20} />
                  </button>

                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left - Info */}
                    <div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-6 glow-sm`}
                      >
                        <DemoIcon size={32} className="text-white" />
                      </motion.div>
                      
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-3xl font-display font-bold mb-2"
                      >
                        {config.name}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-primary mb-4"
                      >
                        {config.tagline}
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="text-muted-foreground mb-6"
                      >
                        {config.description}
                      </motion.p>

                      <ul className="space-y-4 mb-8">
                        {config.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                              <feature.icon size={20} className="text-primary" />
                            </div>
                            <span className="text-muted-foreground">{feature.text}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button 
                          variant="hero" 
                          size="lg" 
                          onClick={() => setShowLanding(false)}
                          className="btn-glow-blue group"
                        >
                          Prova la Demo Interattiva
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Right - Preview */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <div className={`aspect-video rounded-2xl bg-gradient-to-br ${config.color} p-1`}>
                        <div className="w-full h-full glass-strong rounded-xl flex items-center justify-center overflow-hidden">
                          <div className="text-center">
                            <DemoIcon size={48} className="mx-auto mb-4 text-white/50" />
                            <p className="text-white/70">Anteprima Gestionale</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating badge */}
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-4 -right-4 glass-card px-4 py-2 glow-sm"
                      >
                        <span className="text-sm font-medium text-success">✓ 100% Funzionante</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="demo"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-success" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        [DEMO] {config.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="sm" variant="default" onClick={scrollToContact} className="btn-glow-blue">
                        Prenota Consulenza
                      </Button>
                      <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="h-[calc(90vh-180px)] relative">
                    <DemoComponent onBookingComplete={handleBookingComplete} />
                  </div>

                  {/* Footer Note */}
                  <div className="p-3 bg-yellow-500/10 border-t border-yellow-500/20 text-center text-sm text-yellow-500">
                    ⚠️ Questa è una demo. I dati inseriti non vengono salvati.
                  </div>

                  {/* CTA Overlay */}
                  <AnimatePresence>
                    {showCTA && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/95 flex items-center justify-center p-6 z-30"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          className="text-center max-w-md"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                            className="text-5xl mb-4"
                          >
                            🚀
                          </motion.div>
                          <h3 className="text-2xl font-display font-bold mb-4">Ti piace?</h3>
                          <p className="text-muted-foreground mb-6">
                            Posso crearne uno personalizzato per la tua attività con le funzionalità di cui hai bisogno!
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="hero" size="lg" onClick={scrollToContact} className="flex-1 btn-glow-blue">
                              Prenota Consulenza Gratuita
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => setShowCTA(false)} className="flex-1">
                              Continua a esplorare
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
