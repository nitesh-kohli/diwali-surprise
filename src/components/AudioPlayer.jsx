import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audio';
import { diwaliConfig } from '../config/diwaliConfig';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 4500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    const playing = audioManager.toggleMusic();
    setIsPlaying(playing);
    setShowTip(false);
  };

  return (
    <div className="fixed top-3.5 right-4 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showTip && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-neutral-800 text-[#FFD36A] text-xs shadow-md backdrop-blur-md"
          >
            <Music className="w-3 h-3 text-[#FFD36A]" />
            <span>Romantic melody</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSound}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 shadow-sm ${
          isPlaying
            ? 'bg-black/80 border-[#FFD36A]/60 text-[#FFD36A]'
            : 'bg-black/60 border-neutral-800 text-[#A1A1AA] hover:text-white hover:border-[#FFD36A]/40'
        }`}
        title={isPlaying ? 'Mute Music' : 'Play Romantic Diwali Music'}
        aria-label="Toggle romantic music"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#FFD36A]" />
            <div className="flex items-end gap-0.5 h-2.5 w-2.5">
              <span className="w-0.5 bg-[#FFD36A] rounded-full animate-[bounce_0.8s_infinite]" />
              <span className="w-0.5 bg-[#FFD36A] rounded-full animate-[bounce_1.1s_infinite_0.2s]" />
              <span className="w-0.5 bg-[#FFD36A] rounded-full animate-[bounce_0.9s_infinite_0.4s]" />
            </div>
            <span className="text-xs font-medium hidden sm:inline text-white">
              {diwaliConfig.romanticMelodyName}
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 opacity-70" />
            <span className="text-xs font-medium hidden sm:inline opacity-70">
              Music Off
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
