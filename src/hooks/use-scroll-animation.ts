import { useRef } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface ScrollAnimationOptions {
  offset?: [string, string];
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { offset = ["start end", "end start"], springConfig = { stiffness: 100, damping: 30, mass: 1 } } = options;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Smooth spring-based animations
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Common animation transforms
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  
  // Parallax effect
  const parallaxY = useTransform(smoothProgress, [0, 1], [100, -100]);
  const parallaxYSlow = useTransform(smoothProgress, [0, 1], [50, -50]);
  const parallaxYFast = useTransform(smoothProgress, [0, 1], [150, -150]);

  // Rotation effects
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [10, 0, -10]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-5, 0, 5]);

  // 3D perspective
  const perspective = useTransform(smoothProgress, [0, 0.5, 1], [1000, 1200, 1000]);

  return {
    ref,
    scrollYProgress: smoothProgress,
    opacity,
    y,
    scale,
    parallaxY,
    parallaxYSlow,
    parallaxYFast,
    rotateX,
    rotateY,
    perspective,
  };
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Stagger animation variants for children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const blurIn = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
    },
  },
};
