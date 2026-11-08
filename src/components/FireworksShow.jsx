import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronLeft } from 'lucide-react';
import FireworksCanvas from './FireworksCanvas';
import { diwaliConfig } from '../config/diwaliConfig';
import { fireworkAudio } from '../utils/fireworkAudio';

export default function FireworksShow({ onBackToStory }) {
  const { fireworksShow } = diwaliConfig;

  // Running states
  const [isPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef(null);

  // Audio initialization
  useEffect(() => {
    fireworkAudio.init();
    fireworkAudio.setVolume(0.85);
  }, []);

  const toggleSound = () => {
    fireworkAudio.init();
    const muted = fireworkAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#000000] text-white select-none">
      {/* 100% PURE BLACK NIGHT SKY - ZERO GRADIENT OVERLAYS */}

      {/* Top Header with Back to Surprise and Sound Toggle (Matching Reference Photo) */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-none">
        <button
          onClick={onBackToStory}
          className="pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/75 hover:bg-black/90 border border-neutral-800 hover:border-[#FFD36A]/50 text-[#A1A1AA] hover:text-[#FFD36A] text-xs font-medium backdrop-blur-md transition-all shadow-sm cursor-pointer font-serif-royal"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#FFD36A]" />
          <span>{fireworksShow?.backToStoryText || "Back to Surprise 🪔"}</span>
        </button>

        {/* Minimal Audio Control */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
              !isMuted
                ? 'bg-black/75 border-[#FFD36A]/40 text-[#FFD36A]'
                : 'bg-black/40 border-neutral-800 text-neutral-500'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {!isMuted ? (
              <Volume2 className="w-3.5 h-3.5 text-[#FFD36A]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* The Realistic Particle Fireworks Canvas */}
      <FireworksCanvas
        ref={canvasRef}
        isPlaying={isPlaying}
      />

      {/* Bottom Center Instruction: TOUCH ANYWHERE (Matching Reference Photo) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center">
        <p className="text-xs sm:text-sm text-[#FFD36A]/80 font-serif-royal font-light tracking-[0.32em] uppercase drop-shadow-[0_0_12px_rgba(255,211,106,0.4)] select-none">
          TOUCH ANYWHERE
        </p>
      </div>
    </div>
  );
}
