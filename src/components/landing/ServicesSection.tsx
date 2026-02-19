import { Truck, Wrench, Settings, Phone, Check } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: Truck,
    title: "Installazione Gratuita",
    description:
      "Installiamo i distributori automatici direttamente presso la tua sede senza costi aggiuntivi.",
    features: ["Sopralluogo gratuito", "Installazione rapida", "Configurazione personalizzata"],
  },
  {
    icon: Settings,
    title: "Rifornimento Regolare",
    description:
      "Ci occupiamo del rifornimento costante dei prodotti, garantendo sempre disponibilità.",
    features: ["Prodotti freschi", "Rifornimento programmato", "Varietà di scelta"],
  },
  {
    icon: Wrench,
    title: "Manutenzione Completa",
    description:
      "Assistenza tecnica e manutenzione ordinaria incluse nel servizio, per macchine sempre efficienti.",
    features: ["Manutenzione preventiva", "Riparazioni rapide", "Pulizia regolare"],
  },
  {
    icon: Phone,
    title: "Assistenza H24",
    description:
      "Supporto tecnico disponibile 24 ore su 24 per qualsiasi esigenza o emergenza.",
    features: ["Risposta immediata", "Tecnici qualificati", "Interventi rapidi"],
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="servizi" className="py-10 md:py-14 bg-background-alt overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-60 h-60 bg-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" 
      />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="mb-3 text-xl md:text-2xl">
            I Nostri <span className="text-gradient">Servizi</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto px-4">
            Un servizio completo chiavi in mano per la tua tranquillità
          </p>
        </motion.div>

        <motion.div 
          ref={containerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4"
        >
          {services.map((service, serviceIndex) => (
            <motion.div
              key={service.title}
              variants={staggerItem}
              whileHover={{ 
                y: -6, 
                transition: { type: "spring", stiffness: 300, damping: 20 } 
              }}
              className="bg-white border border-primary/10 rounded-lg md:rounded-xl p-3 md:p-4 group cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-2.5 md:mb-4"
              >
                <service.icon size={16} className="text-primary md:w-5 md:h-5" />
              </motion.div>

              <h3 className="text-xs md:text-sm mb-1.5 md:mb-2 text-foreground font-semibold">{service.title}</h3>

              <p className="text-muted-foreground mb-2.5 md:mb-4 leading-relaxed text-[10px] md:text-xs hidden md:block">
                {service.description}
              </p>

              <ul className="space-y-1 md:space-y-1.5">
                {service.features.map((feature, i) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 + serviceIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.4, type: "spring" }}
                    >
                      <Check size={10} className="text-primary md:w-3 md:h-3 flex-shrink-0" />
                    </motion.div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
