import { motion, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Clock, Users } from "lucide-react";
import aboutImage from "@/assets/about-image.jpg";
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ value, suffix = "", duration = 2 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
}

const stats = [
  { icon: Clock, value: "H24", label: "Sempre Disponibili", isAnimated: false },
  { icon: Users, value: 30, label: "Clienti Serviti", isAnimated: true, suffix: "+" },
  { icon: Award, value: 3, label: "Anni di Esperienza", isAnimated: true, suffix: "+" },
];

export default function AboutSection() {
  const scrollToContact = () => {
    document.getElementById("contatti")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="chi-siamo" className="py-10 md:py-14 bg-background-alt relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-primary/3 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-display font-bold mb-4 text-center text-foreground"
          >
            Chi <span className="text-gradient">Siamo</span>
          </motion.h2>

          {/* Content */}
          <div className="space-y-3 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium"
            >
              <span className="text-primary font-semibold">Top Quality Vending</span> è il partner 
              di riferimento per <span className="text-primary font-semibold">distributori automatici</span> in{" "}
              <strong>Puglia</strong>. Operiamo su tutto il territorio regionale: <strong>Bari</strong>,{" "}
              <strong>Taranto</strong>, <strong>Lecce</strong>, <strong>Foggia</strong>,{" "}
              <strong>Brindisi</strong> e provincia <strong>BAT</strong>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium"
            >
              La nostra missione è portare{" "}
              <span className="text-primary font-semibold">qualità e comodità</span> direttamente 
              nel tuo luogo di lavoro. Che tu abbia un ufficio, una palestra, un hotel o un'azienda, 
              abbiamo la soluzione perfetta per te.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium"
            >
              Con <span className="text-primary font-semibold">Top Quality Vending</span>, 
              i tuoi dipendenti e clienti avranno sempre accesso a bevande calde, 
              snack freschi e prodotti di qualità,{" "}
              <span className="text-primary font-semibold">24 ore su 24</span>.
            </motion.p>
          </div>

          {/* About Image */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <img 
              src={aboutImage} 
              alt="Team Top Quality Vending" 
              className="w-full rounded-lg shadow-lg border-2 border-white/20"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-2 mt-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-primary/10 border border-primary/20 rounded-lg p-2.5 md:p-3 text-center hover:bg-primary/20 transition-colors"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                </motion.div>
                <div className="text-lg md:text-xl font-bold text-foreground">
                  {stat.isAnimated ? (
                    <AnimatedCounter value={stat.value as number} suffix={stat.suffix} />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-[9px] md:text-[10px] text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-6 text-center"
          >
            <Button 
              size="sm" 
              onClick={scrollToContact} 
              className="bg-primary text-white hover:bg-primary/90"
            >
              Richiedi Informazioni
              <ArrowRight size={14} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
