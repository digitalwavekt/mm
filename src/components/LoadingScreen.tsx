import { motion } from "framer-motion";
import Logo from "@/components/Logo";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full luxury-gradient opacity-30 blur-xl animate-pulse" />
            <Logo size="lg" className="relative" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold luxury-gradient-text font-['Playfair_Display'] mb-2"
        >
          Mamta Makeover
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/50 text-sm tracking-widest uppercase"
        >
          Where Beauty Meets Artistry
        </motion.p>

        {/* Loading Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
          className="h-0.5 luxury-gradient rounded-full mt-8 max-w-[200px] mx-auto"
        />
      </div>
    </motion.div>
  );
}
