import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

// Import context images
import gymImage from "@/assets/testimonials/gym.jpg";
import hotelImage from "@/assets/testimonials/hotel.jpg";
import officeImage from "@/assets/testimonials/office.jpg";

const testimonials = [
  {
    quote: "Da quando abbiamo i distributori Top Quality, i nostri dipendenti non devono più uscire per il caffè. Produttività aumentata!",
    author: "Marco R.",
    role: "Direttore Palestra",
    image: gymImage,
  },
  {
    quote: "I nostri ospiti apprezzano molto la disponibilità di snack e bevande H24. Un valore aggiunto per il nostro hotel.",
    author: "Giuseppe M.",
    role: "Proprietario B&B",
    image: hotelImage,
  },
  {
    quote: "Servizio impeccabile. Rifornimenti puntuali e prodotti sempre freschi. Lo consiglio a tutti i colleghi imprenditori.",
    author: "Laura B.",
    role: "Titolare Azienda IT",
    image: officeImage,
  },
];

export default function Testimonials() {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <>
      <section className="py-10 md:py-14 bg-background-alt relative overflow-hidden">
        {/* Background animation */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 left-0 w-72 h-72 bg-primary rounded-full blur-3xl -translate-y-1/2" 
        />
        
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="mb-3 text-foreground text-xl md:text-2xl">
              Cosa Dicono i <span className="text-gradient">Nostri Clienti</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto px-4">
              Scopri le esperienze di chi ha scelto Top Quality Vending
            </p>
          </motion.div>

          {/* Testimonials with Context Images */}
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -6 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-lg md:rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Context Image - Clickable with visual indicator */}
                <div 
                  className="relative h-32 md:h-36 overflow-hidden cursor-pointer group"
                  onClick={() => setExpandedImage(testimonial.image)}
                >
                  <motion.img
                    src={testimonial.image}
                    alt={`Distributore in ${testimonial.role}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Always visible zoom icon */}
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                      <path d="M11 8v6"/>
                      <path d="M8 11h6"/>
                    </svg>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                      Clicca per ingrandire
                    </span>
                  </div>
                </div>
                
                {/* Quote Content */}
                <div className="p-3 md:p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                    className="absolute top-28 md:top-32 left-3 md:left-4 text-4xl md:text-5xl text-primary/20 font-serif"
                  >
                    "
                  </motion.div>
                  <p className="text-muted-foreground italic mb-2.5 md:mb-3 mt-1.5 text-xs md:text-sm">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-primary/10 pt-2.5 md:pt-3">
                    <p className="font-semibold text-foreground text-xs md:text-sm">{testimonial.author}</p>
                    <p className="text-[10px] md:text-xs text-primary">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setExpandedImage(null)}
            >
              <X size={24} />
            </motion.button>
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={expandedImage}
              alt="Immagine ingrandita"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
