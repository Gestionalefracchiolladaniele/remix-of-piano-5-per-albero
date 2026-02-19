import { useRef, useEffect, useState } from "react";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroVideo from "@/assets/videos/hero-video.mp4";
import heroFallback from "@/assets/hero-fallback.png";

const trustBadges = [
  "Disponibili H24",
  "Qualità Garantita",
  "Assistenza Rapida",
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contatti")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.querySelector("#servizi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen overflow-hidden bg-primary">
      {/* Fallback Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${heroFallback})` }}
      />
      
      {/* Video Background Fullscreen */}
      <video
        ref={videoRef}
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="section-container text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium mb-4 md:mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Clock size={14} className="text-white" />
            </motion.div>
            <span className="text-white">Distributori Automatici H24</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-white mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight"
          >
            Top Quality{" "}
            <motion.span 
              className="text-primary inline-block"
              animate={{ 
                textShadow: ["0 0 20px rgba(46,127,168,0)", "0 0 40px rgba(46,127,168,0.5)", "0 0 20px rgba(46,127,168,0)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Vending
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-white/90 leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto px-4 font-medium"
          >
            Distributori automatici H24 a <strong>Bari</strong> e in tutta la <strong>Puglia</strong>. 
            Installazione gratuita, rifornimento e assistenza completa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <Button 
              size="default" 
              onClick={scrollToContact} 
              className="bg-primary hover:bg-primary/90 text-white btn-glow-blue text-sm px-5 py-4"
            >
              Richiedi Preventivo Gratuito
              <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              onClick={scrollToServices}
              className="border-white text-white hover:bg-white/10 text-sm px-5 py-4"
            >
              Scopri i Servizi
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 text-xs text-white/90"
              >
                <Check size={14} className="text-primary" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
