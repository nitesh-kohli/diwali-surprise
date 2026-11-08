import { useState, useEffect } from 'react';
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
import { audioManager } from './utils/audio';

export default function App() {
  const getInitialStep = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('fireworks') || search.includes('fireworks') || search.includes('step=6')) {
        return 6;
      }
      const match = search.match(/step=(\d+)/);
      if (match && match[1]) {
        const stepNum = parseInt(match[1], 10);
        if (stepNum >= 1 && stepNum <= 6) return stepNum;
      }
    }
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [previousStep, setPreviousStep] = useState(1);

  const goToStep = (stepNumber) => {
    if (stepNumber !== currentStep) {
      setPreviousStep(currentStep);
    }
    setCurrentStep(stepNumber);

    if (typeof window !== 'undefined') {
      if (stepNumber === 6) {
        window.location.hash = 'fireworks';
        // Stop ambient audio to let firework sound effects shine
        audioManager.stopAmbient();
      } else if (window.location.hash.includes('fireworks')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  };

  // Sync with browser URL hash change (e.g. #fireworks)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.toLowerCase().includes('fireworks')) {
        setCurrentStep(6);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNext = () => {
    const next = Math.min(currentStep + 1, 6);
    goToStep(next);
  };

  const handleReplay = () => {
    goToStep(1);
  };

  const isFireworksMode = currentStep === 6;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#000000] text-white flex flex-col justify-between selection:bg-[#FFD36A]/30">
      {/* 100% PURE BLACK BACKGROUND */}
      <StarfieldBackground />

      {/* Realistic Indian Balcony Diwali String Lights (hidden on Fireworks screen) */}
      {!isFireworksMode && <DiwaliStringLights currentStep={currentStep} />}

      {/* Top Navigation & Direct Fireworks Access (hidden during full-screen fireworks show) */}
      {!isFireworksMode && (
        <Navbar
          currentStep={currentStep}
          setStep={goToStep}
        />
      )}

      {/* Romantic Audio Player floating pill (hidden during fireworks show) */}
      {!isFireworksMode && <AudioPlayer />}

      {/* Main Experience Screen with Smooth Transitions */}
      <main className={`relative z-10 flex-1 flex items-center justify-center ${isFireworksMode ? 'p-0 h-[100dvh]' : 'pt-16 pb-8 px-2 sm:px-4'}`}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1Landing
              key="step1"
              onNext={handleNext}
              onOpenFireworks={() => goToStep(6)}
            />
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
              onBackToStory={() => goToStep(previousStep > 0 && previousStep !== 6 ? previousStep : 1)}
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
