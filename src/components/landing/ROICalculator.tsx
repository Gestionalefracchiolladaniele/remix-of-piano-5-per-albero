import { useState } from "react";
import { Clock, Euro, Users, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [clientsPerMonth, setClientsPerMonth] = useState(50);
  const [valuePerClient, setValuePerClient] = useState(50);

  const scrollToContact = () => {
    document.querySelector("#contatti")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-background-alt bg-pattern-subtle">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="mb-4">
              Quanto Tempo Stai <span className="text-gradient">Perdendo?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Sposta i cursori e scopri il risparmio potenziale
            </p>
          </div>

          <div className="glass-card p-6 md:p-10">
            {/* Sliders */}
            <div className="space-y-8 mb-10">
              {/* Hours Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    Ore settimanali in attività manuali
                  </label>
                  <span className="text-2xl font-bold text-primary">{hoursPerWeek}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={30}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2 ore</span>
                  <span>30 ore</span>
                </div>
              </div>

              {/* Clients Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users size={16} className="text-success" />
                    Clienti gestiti al mese
                  </label>
                  <span className="text-2xl font-bold text-success">{clientsPerMonth}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={500}
                  step={10}
                  value={clientsPerMonth}
                  onChange={(e) => setClientsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-success"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>20</span>
                  <span>500</span>
                </div>
              </div>

              {/* Value Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Euro size={16} className="text-primary" />
                    Valore medio per cliente (€)
                  </label>
                  <span className="text-2xl font-bold text-primary">€{valuePerClient}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={1000}
                  step={10}
                  value={valuePerClient}
                  onChange={(e) => setValuePerClient(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>€20</span>
                  <span>€1000</span>
                </div>
              </div>
            </div>

            {/* Censored Results */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              <div className="bg-gradient-glass p-6">
                <div className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  📊 IL TUO POTENZIALE RISPARMIO
                </div>
                
                {/* Blurred content */}
                <div className="grid md:grid-cols-3 gap-6 blur-censored select-none">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Clock size={16} />
                      Ore risparmiate/anno
                    </div>
                    <div className="text-3xl font-bold text-foreground">
                      520 ore
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Euro size={16} />
                      Valore tempo risparmiato
                    </div>
                    <div className="text-3xl font-bold text-success">
                      €13,000
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Users size={16} />
                      Clienti extra gestibili
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      +15/mese
                    </div>
                  </div>
                </div>

                {/* Overlay with CTA */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/90 via-background/60 to-transparent">
                  <div className="text-center px-4">
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
                      <Lock size={16} className="text-primary" />
                      <span className="text-sm font-medium">Risultati nascosti</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      Vuoi scoprire il tuo risparmio?
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm md:text-base">
                      Richiedi una consulenza gratuita e ti mostrerò i numeri reali per la tua attività
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="hero" size="lg" onClick={scrollToContact} className="w-full btn-glow-blue">
              Richiedi Consulenza Gratuita
              <ArrowRight size={20} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}