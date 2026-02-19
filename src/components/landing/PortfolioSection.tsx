import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

// Import real distributor images
import coffeeMachine from "@/assets/distributors/coffee-machine.jpg";
import coldDrinks from "@/assets/distributors/cold-drinks.jpg";
import snackMachine from "@/assets/distributors/snack-machine.jpg";
import comboMachine from "@/assets/distributors/combo-machine.jpg";

const distributors = [
  {
    id: "caffe",
    category: "Bevande Calde",
    title: "Distributori Caffè",
    description: "Caffè espresso, cappuccino, tè e bevande calde di qualità premium",
    tags: ["Caffè", "Cappuccino", "Tè"],
    image: coffeeMachine,
  },
  {
    id: "bevande",
    category: "Bevande Fredde",
    title: "Distributori Bevande",
    description: "Acqua, bibite, succhi di frutta e bevande energetiche sempre fresche",
    tags: ["Acqua", "Bibite", "Succhi"],
    image: coldDrinks,
  },
  {
    id: "snack",
    category: "Snack",
    title: "Distributori Snack",
    description: "Snack dolci e salati, merendine, patatine e cioccolato per ogni pausa",
    tags: ["Dolci", "Salati", "Cioccolato"],
    image: snackMachine,
  },
  {
    id: "combinati",
    category: "Combinati",
    title: "Distributori Combo",
    description: "Soluzioni all-in-one con bevande calde, fredde e snack in un'unica macchina",
    tags: ["All-in-one", "Versatile", "Compatto"],
    image: comboMachine,
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PortfolioSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="distributori" 
      className="py-10 md:py-14 bg-primary overflow-hidden"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="mb-3 text-white text-xl md:text-2xl">
            I Nostri <span className="text-white/90">Distributori</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
            Scopri la gamma completa di distributori automatici per ogni esigenza
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Arrows */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => scroll("left")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all shadow-sm hidden lg:flex"
          >
            <ChevronLeft size={18} className="text-white" />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => scroll("right")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all shadow-sm hidden lg:flex"
          >
            <ChevronRight size={18} className="text-white" />
          </motion.button>

          {/* Cards Container */}
          <motion.div
            ref={scrollRef}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex gap-3 md:gap-4 overflow-x-auto snap-x hide-scrollbar pb-3 px-1"
          >
            {distributors.map((item, index) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="flex-shrink-0 w-52 md:w-64 bg-white border border-primary/10 rounded-lg md:rounded-xl overflow-hidden snap-center group hover:border-primary/30 hover:shadow-lg transition-all"
              >
                {/* Real Image */}
                <div className="relative h-32 md:h-36 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Category Badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary text-white backdrop-blur-sm px-2 py-0.5 md:px-2.5 rounded-full text-[9px] md:text-[10px] font-semibold"
                  >
                    {item.category}
                  </motion.div>
                </div>

                {/* Card Content */}
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base mb-1 md:mb-1.5 text-foreground font-semibold">{item.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-2.5 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {item.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: tagIndex * 0.05 + 0.3 }}
                        className="bg-primary/5 border border-primary/10 px-1.5 py-0.5 md:px-2 rounded-full text-[9px] md:text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {distributors.map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-primary/20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
