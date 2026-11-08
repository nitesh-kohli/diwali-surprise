import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { diwaliConfig } from '../config/diwaliConfig';

export default function Navbar({ currentStep, setStep, maxUnlockedStep }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:py-4 pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* <div className="p-1 rounded-full bg-black/60 border border-neutral-800 text-[#FFD36A]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD36A]" />
          </div> */}
          {/* <div className="text-left">
            <h1 className="text-xs sm:text-sm font-semibold tracking-wide text-white flex items-center gap-1.5 font-serif-royal">

              <Heart className="w-2.5 h-2.5 text-[#FFD36A] fill-[#FFD36A] inline" />
            </h1>
            <p className="text-[10px] text-[#A1A1AA] font-light hidden sm:block">
              For {diwaliConfig.herName} • With all my love
            </p>
          </div> */}
        </div>

        {/* Minimalist Step Indicator */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 mr-16 sm:mr-32">
          {diwaliConfig.steps.map((step) => {
            const isCurrent = currentStep === step.id;
            const isUnlocked = step.id <= maxUnlockedStep;

            return (
              <button
                key={step.id}
                onClick={() => isUnlocked && setStep(step.id)}
                disabled={!isUnlocked}
                className={`group relative transition-all duration-300 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'
                  }`}
                aria-label={`Go to ${step.label}`}
                title={step.label}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${isCurrent
                    ? 'w-5 bg-[#FFD36A] shadow-[0_0_8px_rgba(255,211,106,0.6)]'
                    : isUnlocked
                      ? 'w-1.5 bg-neutral-600 hover:bg-[#FFD36A]'
                      : 'w-1 bg-neutral-800'
                    }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
