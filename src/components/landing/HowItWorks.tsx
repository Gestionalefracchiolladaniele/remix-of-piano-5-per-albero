import { MessageCircle, Laptop, HeartHandshake } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    color: "primary",
    title: "Consulenza Gratuita",
    description:
      "Parliamo 30 minuti delle tue esigenze. Capisco il tuo flusso di lavoro e ti propongo la soluzione migliore. Zero impegno.",
    time: "30 min",
  },
  {
    number: "02",
    icon: Laptop,
    color: "primary",
    title: "Sviluppo Su Misura",
    description:
      "Creo la tua web app personalizzata. Ti mostro l'avanzamento in tempo reale e raccolgo i tuoi feedback.",
    time: "2-4 settimane",
  },
  {
    number: "03",
    icon: HeartHandshake,
    color: "success",
    title: "Consegna + Supporto",
    description:
      "Ti consegno l'app, ti formo sull'utilizzo, e resto disponibile per assistenza e aggiornamenti futuri.",
    time: "Supporto continuo",
  },
];

const colorClasses = {
  primary: "bg-primary/20 text-primary border-primary/30",
  success: "bg-success/20 text-success border-success/30",
};

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section 
      ref={sectionRef}
      id="come-funziona" 
      className="section-padding bg-background bg-pattern overflow-hidden"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">
            Come <span className="text-gradient">Lavoriamo</span> Insieme
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <div className="h-px bg-white/10 w-full" />
            <motion.div 
              className="h-px bg-gradient-to-r from-primary via-primary to-success absolute top-0 left-0"
              style={{ width: lineWidth }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px -10px hsla(217, 91%, 60%, 0.3)",
                }}
                className="relative glass-card p-8 text-center"
                style={{ perspective: 1000 }}
              >
                {/* Animated Number Background */}
                <motion.div 
                  className="absolute top-4 left-4 text-7xl font-display font-bold text-primary/10 select-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring", bounce: 0.4 }}
                  viewport={{ once: true }}
                >
                  {step.number}
                </motion.div>

                {/* Icon with pulse effect */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.2 + 0.1, 
                    type: "spring", 
                    stiffness: 200,
                    damping: 15,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  className={`relative z-10 w-16 h-16 rounded-2xl ${
                    colorClasses[step.color as keyof typeof colorClasses]
                  } border flex items-center justify-center mx-auto mb-6`}
                >
                  <step.icon size={32} />
                  {/* Pulse ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl ${
                      step.color === "success" ? "bg-success/20" : "bg-primary/20"
                    }`}
                    animate={{ 
                      scale: [1, 1.3, 1.3],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                </motion.div>

                <motion.h3 
                  className="mb-3 relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {step.title}
                </motion.h3>

                <motion.p 
                  className="text-muted-foreground mb-4 relative z-10 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {step.description}
                </motion.p>

                <motion.div 
                  className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium relative z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  ⏱️ {step.time}
                </motion.div>

                {/* Connector dot for desktop */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.3 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center glow-sm">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
