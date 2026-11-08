import { Sparkles } from 'lucide-react';
import { diwaliConfig } from '../config/diwaliConfig';

export default function Navbar({ currentStep, setStep }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:py-4 pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Direct Fireworks Sky Access Pill */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setStep(6)}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-serif-royal font-medium transition-all cursor-pointer backdrop-blur-md shadow-sm ${
              currentStep === 6
                ? 'bg-[#FFD36A] text-black shadow-[0_0_12px_rgba(255,211,106,0.5)]'
                : 'bg-black/70 border border-neutral-800 hover:border-[#FFD36A]/50 text-[#FFD36A] hover:bg-black/90'
            }`}
            title="Open Fireworks Night Sky"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fireworks Sky 🎆</span>
          </button>
        </div>

        {/* Minimalist Step Indicator - All Steps Clickable */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 mr-16 sm:mr-32">
          {diwaliConfig.steps.map((step) => {
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className="group relative transition-all duration-300 cursor-pointer p-1"
                aria-label={`Go to ${step.label}`}
                title={step.label}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-5 bg-[#FFD36A] shadow-[0_0_8px_rgba(255,211,106,0.6)]'
                      : 'w-1.5 bg-neutral-600 hover:bg-[#FFD36A]'
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
