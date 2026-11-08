import { motion } from 'framer-motion';
import { Sparkles, Heart, ChevronRight } from 'lucide-react';
import DiyaGraphic from './DiyaGraphic';
import { diwaliConfig } from '../config/diwaliConfig';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function Step1Landing({ onNext, onOpenFireworks }) {
  const { landing } = diwaliConfig;

  const handleStart = () => {
    audioManager.init();
    audioManager.playMagicChime();

    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#FFD36A', '#E5A93D', '#FFFFFF'],
      disableForReducedMotion: true,
    });

    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 min-h-[90dvh] flex flex-col items-center justify-center text-center px-4 py-12 max-w-2xl mx-auto"
    >
      {/* Minimal luxury badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 text-[#FFD36A] text-xs font-serif-royal mb-6 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#FFD36A]" />
        <span>{landing.badge}</span>
      </motion.div>

      {/* Centerpiece Animated Diya on pure black */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          damping: 18,
          stiffness: 90,
          delay: 0.3,
        }}
        className="relative my-6 sm:my-8 floating-anim"
      >
        <DiyaGraphic isLit={true} size="lg" glowIntensity="normal" />
      </motion.div>

      {/* Main Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="space-y-4 max-w-lg"
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-serif-royal leading-tight">
          <span className="shimmer-text">{landing.greeting}</span>
        </h1>

        <p className="text-base sm:text-lg text-[#A1A1AA] font-light leading-relaxed px-2">
          {landing.subtext}
        </p>
      </motion.div>

      {/* Minimalist Golden Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8 sm:mt-10 flex flex-col items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          className="relative px-8 sm:px-10 py-3.5 rounded-full font-serif-royal text-sm sm:text-base font-semibold tracking-wider text-black bg-[#FFD36A] hover:bg-[#FFE58F] transition-all duration-300 shadow-[0_0_20px_rgba(255,211,106,0.35)] cursor-pointer flex items-center gap-2"
        >
          <span>{landing.buttonText}</span>
          <ChevronRight className="w-4 h-4 text-black" />
        </motion.button>

        <p className="text-xs text-[#A1A1AA]/70 font-light tracking-wide flex items-center gap-1.5">
          <Heart className="w-2.5 h-2.5 text-[#FFD36A] fill-[#FFD36A]" />
          <span>{landing.hint}</span>
        </p>

        {/* Direct Fireworks Sky Access */}
        {onOpenFireworks && (
          <button
            onClick={onOpenFireworks}
            className="mt-2 text-xs text-[#FFD36A]/80 hover:text-[#FFD36A] font-serif-royal flex items-center gap-1.5 transition-colors cursor-pointer underline underline-offset-4 decoration-[#FFD36A]/30 hover:decoration-[#FFD36A]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD36A]" />
            <span>Experience Fireworks Sky Directly 🎆</span>
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
