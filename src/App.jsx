import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StarfieldBackground from './components/StarfieldBackground';
import DiwaliStringLights from './components/DiwaliStringLights';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Step1Landing from './components/Step1Landing';
import Step2Magic from './components/Step2Magic';
import Step3Letter from './components/Step3Letter';
import Step4InteractiveDiya from './components/Step4InteractiveDiya';
import Step5Finale from './components/Step5Finale';
import FireworksShow from './components/FireworksShow';
import { diwaliConfig } from './config/diwaliConfig';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    setMaxUnlockedStep((prev) => Math.max(prev, stepNumber));
  };

  const handleNext = () => {
    const next = Math.min(currentStep + 1, 6);
    goToStep(next);
  };

  const handleReplay = () => {
    setCurrentStep(1);
  };

  const isFireworksMode = currentStep === 6;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#000000] text-white flex flex-col justify-between selection:bg-[#FFD36A]/30">
      {/* 100% PURE BLACK BACKGROUND - ZERO COLORED GRADIENTS */}
      <StarfieldBackground />

      {/* Realistic Indian Balcony Diwali String Lights (rendered on all pages EXCEPT Fireworks) */}
      {!isFireworksMode && <DiwaliStringLights currentStep={currentStep} />}

      {/* Top Navigation & Brand Header (hidden during full-screen fireworks show) */}
      {!isFireworksMode && (
        <Navbar
          currentStep={currentStep}
          setStep={goToStep}
          maxUnlockedStep={maxUnlockedStep}
        />
      )}

      {/* Romantic Audio Player floating pill (hidden during fireworks show which has its own controls) */}
      {!isFireworksMode && <AudioPlayer />}

      {/* Main Experience Screen with Smooth Transitions */}
      <main className={`relative z-10 flex-1 flex items-center justify-center ${isFireworksMode ? 'p-0 h-[100dvh]' : 'pt-16 pb-8 px-2 sm:px-4'}`}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1Landing key="step1" onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <Step2Magic key="step2" onNext={handleNext} />
          )}
          {currentStep === 3 && (
            <Step3Letter key="step3" onNext={handleNext} />
          )}
          {currentStep === 4 && (
            <Step4InteractiveDiya key="step4" onNext={handleNext} />
          )}
          {currentStep === 5 && (
            <Step5Finale
              key="step5"
              onReplay={handleReplay}
              onOpenFireworks={() => goToStep(6)}
            />
          )}
          {currentStep === 6 && (
            <FireworksShow
              key="step6"
              onBackToStory={() => goToStep(5)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Minimal Romantic Bottom Footer */}
      {!isFireworksMode && (
        <footer className="relative z-10 py-3 text-center text-[11px] text-[#A1A1AA]/50 font-light tracking-widest uppercase pointer-events-none font-serif-royal">
          Crafted with love for {diwaliConfig.herName} • Happy Diwali 🪔
        </footer>
      )}
    </div>
  );
}
