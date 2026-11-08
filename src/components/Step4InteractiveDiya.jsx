import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Flame } from 'lucide-react';
import DiyaGraphic from './DiyaGraphic';
import { diwaliConfig } from '../config/diwaliConfig';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function Step4InteractiveDiya({ onNext }) {
  const { interactiveDiya } = diwaliConfig;
  const [isLit, setIsLit] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleLightDiya = () => {
    if (isLit) return;

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 800);

    audioManager.playDiyaIgniteSound();
    setIsLit(true);

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#FFD36A', '#E5A93D', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  };

  const handleNext = () => {
    audioManager.playMagicChime();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 min-h-[90dvh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-2xl mx-auto"
    >
      {/* Subtle warm golden flash on ignition */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-radial from-amber-200/30 to-transparent pointer-events-none z-30"
          />
        )}
      </AnimatePresence>

      {/* Auspicious Minimal Tag */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[#FFD36A] text-[11px] font-serif-royal mb-3 tracking-widest uppercase"
      >
        <Flame className="w-3 h-3 text-[#FFD36A]" />
        <span>{interactiveDiya.tag}</span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-bold font-serif-royal text-white mb-2"
      >
        <span className="shimmer-text">{interactiveDiya.title}</span>
      </motion.h2>

      {/* Instruction / Status */}
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="text-xs sm:text-sm text-[#A1A1AA] mb-6 font-light"
      >
        {isLit ? (
          <span className="text-[#FFD36A] font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD36A]" />
            {interactiveDiya.flameLitBadge}
          </span>
        ) : (
          interactiveDiya.instruction
        )}
      </motion.p>

      {/* Large Virtual Diya on pure black */}
      <div className="relative my-4 flex flex-col items-center">
        {!isLit && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 -m-3 rounded-full border border-[#FFD36A]/40 pointer-events-none"
          />
        )}

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLightDiya}
          className="cursor-pointer select-none transition-transform"
        >
          <DiyaGraphic
            isLit={isLit}
            size="xl"
            glowIntensity={isLit ? 'normal' : 'soft'}
            interactive={true}
          />
        </motion.div>

        {!isLit && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-4 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#FFD36A] text-xs font-light cursor-pointer shadow-sm"
            onClick={handleLightDiya}
          >
            Touch the flame to light
          </motion.div>
        )}
      </div>

      {/* Revealed Emotional Message on pure black */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 shadow-2xl max-w-xl mx-auto"
          >
            <p className="text-base sm:text-xl font-serif-royal font-light text-[#FFD36A] leading-relaxed italic text-gold-glow">
              &ldquo;{interactiveDiya.revealedMessage}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proceed Button */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleNext}
              className="px-8 py-3 rounded-full font-serif-royal text-sm sm:text-base font-semibold bg-[#FFD36A] hover:bg-[#FFE58F] text-black shadow-[0_0_18px_rgba(255,211,106,0.3)] flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{interactiveDiya.nextButtonText}</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
