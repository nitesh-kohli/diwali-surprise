import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ChevronRight } from 'lucide-react';
import DiyaGraphic from './DiyaGraphic';
import { diwaliConfig } from '../config/diwaliConfig';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function Step2Magic({ onNext }) {
  const { magic } = diwaliConfig;
  const totalDiyas = magic.diyaCount || 5;

  const [litCount, setLitCount] = useState(0);
  const [isFullyLit, setIsFullyLit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLitCount((prev) => {
        const next = prev + 1;
        if (next <= totalDiyas) {
          audioManager.playDiyaIgniteSound();

          confetti({
            particleCount: 18,
            spread: 40,
            startVelocity: 16,
            origin: {
              x: (next / (totalDiyas + 1)),
              y: 0.55,
            },
            colors: ['#FFD36A', '#E5A93D', '#FFFFFF'],
            disableForReducedMotion: true,
          });
        }
        if (next >= totalDiyas) {
          clearInterval(interval);
          setTimeout(() => setIsFullyLit(true), 500);
        }
        return Math.min(next, totalDiyas);
      });
    }, 650);

    return () => clearInterval(interval);
  }, [totalDiyas]);

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
      className="relative z-10 min-h-[90dvh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-3xl mx-auto"
    >
      {/* Category Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#FFD36A] uppercase font-serif-royal mb-2"
      >
        ✦ {magic.subtitle} ✦
      </motion.p>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif-royal text-white mb-6"
      >
        <span className="shimmer-text">{magic.title}</span>
      </motion.h2>

      {/* Auspicious Sequential Diyas on Pure Black */}
      <div className="relative w-full max-w-xl py-6 my-2 flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
        {Array.from({ length: totalDiyas }).map((_, index) => {
          const isLit = index < litCount;
          const offset = Math.abs(index - Math.floor(totalDiyas / 2)) * 6;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: isLit ? 1.05 : 0.95,
                y: offset,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 14,
              }}
              className="relative p-1"
            >
              <DiyaGraphic
                isLit={isLit}
                size={index === Math.floor(totalDiyas / 2) ? 'md' : 'sm'}
                glowIntensity={isLit ? 'normal' : 'soft'}
              />

              <AnimatePresence>
                {isLit && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2"
                  >
                    <Sparkles className="w-3 h-3 text-[#FFD36A]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Minimal Counter */}
      <p className="text-xs text-[#A1A1AA] tracking-wider mb-6 font-mono">
        {litCount} of {totalDiyas} Diyas Illuminated
      </p>

      {/* Heartfelt Quote - Minimal Black and Fine Gold Hairline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: litCount >= 2 ? 1 : 0.25,
          y: litCount >= 2 ? 0 : 10,
        }}
        transition={{ duration: 0.6 }}
        className="relative max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 shadow-xl"
      >
        <p className="text-lg sm:text-2xl md:text-3xl font-serif-royal font-light text-[#FFD36A] leading-relaxed italic text-gold-glow">
          &ldquo;{magic.quote}&rdquo;
        </p>

        <p className="mt-4 text-xs sm:text-sm text-[#A1A1AA] font-light max-w-md mx-auto">
          {magic.description}
        </p>
      </motion.div>

      {/* Continue Button */}
      <AnimatePresence>
        {isFullyLit && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleNext}
              className="px-8 py-3 rounded-full font-serif-royal text-sm sm:text-base font-semibold bg-[#FFD36A] hover:bg-[#FFE58F] text-black shadow-[0_0_18px_rgba(255,211,106,0.3)] flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{magic.nextButtonText}</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
