import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Share2, Check } from 'lucide-react';
import DiyaGraphic from './DiyaGraphic';
import { diwaliConfig } from '../config/diwaliConfig';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function Step5Finale({ onReplay, onOpenFireworks }) {
  const { finale, herName, yourName } = diwaliConfig;
  const [copied, setCopied] = useState(false);
  const [customHearts, setCustomHearts] = useState([]);

  useEffect(() => {
    audioManager.playMagicChime();

    const triggerBurst = (x, y) => {
      audioManager.playFireworkBurst();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x, y },
        colors: ['#FFD36A', '#E5A93D', '#FFFFFF', '#f43f5e'],
        disableForReducedMotion: true,
      });
    };

    triggerBurst(0.3, 0.4);
    setTimeout(() => triggerBurst(0.7, 0.35), 600);

    const interval = setInterval(() => {
      const rx = 0.25 + Math.random() * 0.5;
      const ry = 0.2 + Math.random() * 0.35;
      triggerBurst(rx, ry);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleScreenTouch = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!clientX || !clientY) return;

    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;

    audioManager.playFireworkBurst();

    confetti({
      particleCount: 20,
      spread: 50,
      startVelocity: 20,
      origin: { x, y },
      colors: ['#FFD36A', '#f43f5e', '#FFFFFF'],
      disableForReducedMotion: true,
    });

    const id = Date.now() + Math.random();
    setCustomHearts((prev) => [
      ...prev.slice(-10),
      { id, x: clientX, y: clientY },
    ]);

    setTimeout(() => {
      setCustomHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  const handleShare = async () => {
    const text = `${finale.shareMessage}\n\n- With love from ${yourName}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Diwali Night Written Just for You',
          text,
          url: window.location.href,
        });
      } catch {
        // Handled
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      onClick={handleScreenTouch}
      className="relative z-10 min-h-[92dvh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-2xl mx-auto cursor-crosshair select-none"
    >
      {/* Floating tap-spawned hearts */}
      {customHearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 1, scale: 0.6, y: 0 }}
          animate={{ opacity: 0, scale: 1.4, y: -60 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="fixed pointer-events-none z-50 text-[#FFD36A]"
          style={{ left: heart.x - 12, top: heart.y - 12 }}
        >
          <Heart className="w-5 h-5 fill-[#FFD36A]" />
        </motion.div>
      ))}

      {/* Floating background embers on black */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: '100%',
              x: `${15 + i * 14}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: '-10%',
            }}
            transition={{
              duration: 8 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'easeInOut',
            }}
            className="absolute text-[#FFD36A]/30"
          >
            <Heart className="w-3.5 h-3.5 fill-[#FFD36A]/25" />
          </motion.div>
        ))}
      </div>

      {/* Auspicious Minimal Tag */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[#FFD36A] text-[11px] font-serif-royal mb-4 tracking-widest uppercase"
      >
        <Sparkles className="w-3 h-3 text-[#FFD36A]" />
        <span>{finale.badge}</span>
      </motion.div>

      {/* Twin mini diyas flanking title */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <DiyaGraphic isLit={true} size="sm" glowIntensity="normal" />
        <h2 className="text-xl sm:text-3xl font-serif-royal font-bold text-[#FFD36A] tracking-wide">
          Happy Diwali, {herName}
        </h2>
        <DiyaGraphic isLit={true} size="sm" glowIntensity="normal" />
      </div>

      {/* Main Emotional Quote Card on pure black */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative my-4 p-6 sm:p-10 rounded-2xl bg-black border border-neutral-800 shadow-2xl max-w-xl mx-auto"
      >
        <p className="text-xl sm:text-3xl md:text-4xl font-serif-royal font-bold text-white leading-snug tracking-wide">
          &ldquo;{finale.mainQuote}&rdquo;
        </p>

        <p className="mt-4 text-xs sm:text-base text-[#A1A1AA] font-light leading-relaxed">
          {finale.subtext}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-[#A1A1AA] font-serif-royal text-sm">
          <span>Forever Yours,</span>
          <span className="font-semibold text-[#FFD36A]">{yourName}</span>
          <Heart className="w-3.5 h-3.5 text-[#FFD36A] fill-[#FFD36A] inline" />
        </div>
      </motion.div>

      {/* Dedicated Fireworks Show Glowing Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="my-5 z-20 w-full max-w-xs"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenFireworks) onOpenFireworks();
          }}
          className="relative w-full py-3.5 px-8 rounded-full font-serif-royal text-base font-semibold text-black bg-[#FFD36A] hover:bg-[#FFE58F] shadow-[0_0_24px_rgba(255,211,106,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>{finale.fireworksButtonText || "Light Up The Sky ✨"}</span>
        </motion.button>
      </motion.div>

      {/* Minimal Action Links */}
      <div className="flex items-center justify-center gap-3 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplay();
          }}
          className="px-4 py-2 rounded-full font-serif-royal text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#A1A1AA]" />
          <span>{finale.replayButtonText}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="px-4 py-2 rounded-full font-serif-royal text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[#A1A1AA] hover:text-[#FFD36A] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#FFD36A]" />
              <span>Share Love 💌</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
