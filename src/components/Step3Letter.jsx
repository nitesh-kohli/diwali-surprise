import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Copy, Check } from 'lucide-react';
import { diwaliConfig } from '../config/diwaliConfig';
import { audioManager } from '../utils/audio';

export default function Step3Letter({ onNext }) {
  const { letter, herName, yourName } = diwaliConfig;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `Dearest ${herName},\n\n${letter.body}\n\n${letter.closing}\n${yourName}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
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
      {/* Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[#FFD36A] text-[11px] font-serif-royal mb-4 tracking-widest uppercase"
      >
        <Heart className="w-2.5 h-2.5 text-[#FFD36A] fill-[#FFD36A]" />
        <span>{letter.tag}</span>
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl sm:text-4xl font-bold font-serif-royal text-white mb-6"
      >
        <span className="shimmer-text">{letter.title}</span>
      </motion.h2>

      {/* Minimalist Luxury Love Letter Card on Pure Black */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="relative w-full max-w-xl mx-auto text-left rounded-2xl p-6 sm:p-10 bg-black border border-neutral-800 shadow-2xl"
      >
        {/* Subtle Hairline Golden Corners */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#FFD36A]/40 rounded-tl pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#FFD36A]/40 rounded-tr pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#FFD36A]/40 rounded-bl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#FFD36A]/40 rounded-br pointer-events-none" />

        {/* Letter Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🪔</span>
            <div>
              <p className="text-sm font-semibold font-serif-royal text-white">
                To My Dearest {herName}
              </p>
              <p className="text-[11px] text-[#A1A1AA]">A Diwali Night Dedicated to You</p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Save Letter"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-300">Saved</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Save</span>
              </>
            )}
          </button>
        </div>

        {/* Letter Body in Pure White with Gold Dropcap */}
        <div className="space-y-4 text-white text-base sm:text-lg leading-relaxed font-serif-royal font-light">
          <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#FFD36A] first-letter:mr-1.5 first-letter:float-left">
            {letter.body}
          </p>
        </div>

        {/* Letter Sign-off */}
        <div className="mt-8 pt-4 border-t border-neutral-800/80 flex flex-col items-end">
          <p className="text-xs text-[#A1A1AA] font-light italic">
            {letter.closing}
          </p>
          <p className="text-base sm:text-lg font-serif-royal font-semibold text-[#FFD36A] mt-1 flex items-center gap-1.5">
            <span>{yourName}</span>
            <Heart className="w-3.5 h-3.5 text-[#FFD36A] fill-[#FFD36A] inline" />
          </p>
        </div>
      </motion.div>

      {/* Button to proceed to interactive Diya */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          className="px-8 py-3 rounded-full font-serif-royal text-sm sm:text-base font-semibold bg-[#FFD36A] hover:bg-[#FFE58F] text-black shadow-[0_0_18px_rgba(255,211,106,0.3)] flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>{letter.nextButtonText}</span>
          <ChevronRight className="w-4 h-4 text-black" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
