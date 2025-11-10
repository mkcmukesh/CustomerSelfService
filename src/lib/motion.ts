import { Variants } from "framer-motion";

// fade + slide up on enter
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// container that staggers children
export const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

// micro-interactions
export const hoverLift = { y: -4, scale: 1.01, boxShadow: "0 12px 32px -16px rgba(0,0,0,.25)" };
export const tapPress  = { y: 0, scale: 0.995 };
export const imgZoom   = { scale: 1.03 };
