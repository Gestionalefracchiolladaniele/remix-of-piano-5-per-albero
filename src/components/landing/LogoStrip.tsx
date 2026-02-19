import { Briefcase, Scissors, UtensilsCrossed, Home, Sparkles, Calculator } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Ristoranti", icon: UtensilsCrossed },
  { name: "Barbieri", icon: Scissors },
  { name: "B&B", icon: Home },
  { name: "Centri Estetici", icon: Sparkles },
  { name: "Consulenti", icon: Calculator },
];

export default function LogoStrip() {
  return (
    <section className="py-10 bg-background border-y border-white/5">
      <div className="section-container">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <span className="text-muted-foreground text-sm font-medium">
            Soluzioni per:
          </span>
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors cursor-default group"
            >
              <category.icon
                size={20}
                className="group-hover:text-primary transition-colors"
              />
              <span className="text-sm font-medium hidden sm:inline">
                {category.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}