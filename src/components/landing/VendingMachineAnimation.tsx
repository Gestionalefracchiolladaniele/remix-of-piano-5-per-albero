import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/logo-new.png";

export default function VendingMachineAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Animation transforms based on scroll
  const machineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const machineX = useTransform(scrollYProgress, [0, 0.1], [100, 0]);
  const logoY = useTransform(scrollYProgress, [0.15, 0.5], [-120, 180]);
  const logoScale = useTransform(scrollYProgress, [0.15, 0.3, 0.5], [0.3, 0.5, 0.8]);
  const logoOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const doorRotateY = useTransform(scrollYProgress, [0.7, 0.85], [0, -75]);
  const logoFinalScale = useTransform(scrollYProgress, [0.85, 1], [0.8, 1.2]);
  const glowOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  return (
    <div 
      ref={containerRef}
      className="fixed right-6 lg:right-16 top-1/2 -translate-y-1/2 z-50 hidden lg:block pointer-events-none"
    >
      <motion.div
        style={{ opacity: machineOpacity, x: machineX }}
        className="relative w-56 h-96"
      >
        {/* Vending Machine Body - White with Azure accents */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border-4 border-primary overflow-hidden">
          {/* Machine Top */}
          <div className="h-10 bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold tracking-wider">TOP QUALITY</span>
          </div>
          
          {/* Display Window */}
          <div className="relative mx-4 mt-4 h-40 bg-gradient-to-b from-primary/10 to-primary/5 rounded-xl border-2 border-primary/30 overflow-hidden">
            {/* Products shelves simulation */}
            <div className="absolute inset-0 flex flex-col justify-around p-3">
              <div className="flex justify-around">
                <div className="w-8 h-10 bg-primary/20 rounded" />
                <div className="w-8 h-10 bg-primary/30 rounded" />
                <div className="w-8 h-10 bg-primary/20 rounded" />
              </div>
              <div className="flex justify-around">
                <div className="w-8 h-10 bg-primary/30 rounded" />
                <div className="w-8 h-10 bg-primary/20 rounded" />
                <div className="w-8 h-10 bg-primary/30 rounded" />
              </div>
            </div>
            
            {/* Falling Logo */}
            <motion.div
              style={{ 
                y: logoY, 
                scale: logoScale, 
                opacity: logoOpacity 
              }}
              className="absolute left-1/2 -translate-x-1/2 z-10"
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="w-20 h-20 object-contain drop-shadow-lg"
              />
            </motion.div>
          </div>
          
          {/* Pickup Area with Door */}
          <div className="relative mx-4 mt-4 h-24 bg-primary/5 rounded-xl border-2 border-primary/30 overflow-hidden" style={{ perspective: "200px" }}>
            {/* Door */}
            <motion.div
              style={{ rotateY: doorRotateY }}
              className="absolute inset-0 bg-white rounded-xl border-2 border-primary/40 origin-left flex items-center justify-center"
            >
              <div className="w-10 h-1.5 bg-primary/50 rounded-full" />
            </motion.div>
            
            {/* Logo revealed behind door */}
            <motion.div
              style={{ scale: logoFinalScale }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                style={{ opacity: glowOpacity }}
                className="relative"
              >
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 object-contain"
                />
                <motion.div
                  style={{ opacity: glowOpacity }}
                  className="absolute inset-0 blur-lg"
                >
                  <img 
                    src={logo} 
                    alt="" 
                    className="w-14 h-14 object-contain opacity-60"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Payment Panel */}
          <div className="mx-4 mt-4 flex gap-2">
            <div className="flex-1 h-10 bg-primary/5 rounded-lg border-2 border-primary/30 flex items-center justify-center">
              <div className="w-12 h-1.5 bg-primary rounded" />
            </div>
            <div className="w-10 h-10 bg-primary/5 rounded-lg border-2 border-primary/30 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary/50 rounded-full" />
            </div>
          </div>
          
          {/* Keypad */}
          <div className="mx-4 mt-3 grid grid-cols-3 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div 
                key={num}
                className="h-5 bg-primary/10 rounded border border-primary/30 flex items-center justify-center"
              >
                <span className="text-primary/70 text-xs font-medium">{num}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Machine Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-primary/20 blur-xl rounded-full" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(46,127,168,0.3)] pointer-events-none" />
      </motion.div>
    </div>
  );
}
