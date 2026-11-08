import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Palette definitions matching realistic Diwali LED bulbs
const BULB_COLORS = {
  gold: { hex: '#FFD36A', glow: 'rgba(255, 211, 106, 0.75)', outer: 'rgba(255, 211, 106, 0.22)' },
  orange: { hex: '#FF7A00', glow: 'rgba(255, 122, 0, 0.75)', outer: 'rgba(255, 122, 0, 0.22)' },
  red: { hex: '#FF1744', glow: 'rgba(255, 23, 68, 0.8)', outer: 'rgba(255, 23, 68, 0.25)' },
  green: { hex: '#00E676', glow: 'rgba(0, 230, 118, 0.75)', outer: 'rgba(0, 230, 118, 0.22)' },
  blue: { hex: '#00B0FF', glow: 'rgba(0, 176, 255, 0.8)', outer: 'rgba(0, 176, 255, 0.25)' },
  pink: { hex: '#FF4081', glow: 'rgba(255, 64, 129, 0.75)', outer: 'rgba(255, 64, 129, 0.22)' },
  purple: { hex: '#D500F9', glow: 'rgba(213, 0, 249, 0.75)', outer: 'rgba(213, 0, 249, 0.22)' },
  warmWhite: { hex: '#FFF3E0', glow: 'rgba(255, 243, 224, 0.85)', outer: 'rgba(255, 243, 224, 0.25)' },
};

// Page-specific color themes
const THEME_PALETTES = {
  // Step 1 Landing: Festive multicolor with warm gold dominance
  1: ['gold', 'red', 'green', 'blue', 'orange', 'pink', 'warmWhite', 'purple'],
  // Step 2 Diwali Magic: Vibrant multicolor with flowing rhythm
  2: ['gold', 'orange', 'red', 'pink', 'purple', 'blue', 'green', 'warmWhite'],
  // Step 3 Love Letter: Romantic & soft (warm white, gold, pink, ruby red)
  3: ['warmWhite', 'gold', 'pink', 'red', 'warmWhite', 'gold', 'pink'],
  // Step 4 Interactive Diya: Sacred warm glow (gold, orange, amber, warm white)
  4: ['gold', 'orange', 'warmWhite', 'gold', 'orange', 'warmWhite'],
  // Step 5 Finale: Full celebratory festival spectrum
  5: ['gold', 'red', 'green', 'blue', 'orange', 'pink', 'warmWhite', 'purple'],
};

export default function DiwaliStringLights({ currentStep = 1 }) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width >= 640 && dimensions.width < 1024;

  // Build natural catenary wire curves based on screen width
  const { topSwags, sideDrape, bulbs } = useMemo(() => {
    const w = dimensions.width;
    const numSwags = isMobile ? 3 : isTablet ? 4 : 5;
    const swagWidth = w / numSwags;

    let pathD = `M 0,10`;
    const generatedBulbs = [];
    const activePaletteKeys = THEME_PALETTES[currentStep] || THEME_PALETTES[1];

    // Generate Scalloped Hanging Swags across Top Edge
    for (let i = 0; i < numSwags; i++) {
      const startX = i * swagWidth;
      const endX = (i + 1) * swagWidth;
      const midX = startX + swagWidth * 0.5;

      // Natural catenary droop depth: slightly varied for realism
      const droop = isMobile ? 24 + (i % 2) * 6 : 38 + (i % 3) * 8;
      const controlY = 10 + droop;

      pathD += ` Q ${midX},${controlY} ${endX},10`;

      // Distribute bulbs along this swag curve
      const bulbsPerSwag = isMobile ? 5 : 7;
      for (let b = 0; b < bulbsPerSwag; b++) {
        // Parametric t from ~0.08 to 0.92
        const t = (b + 0.6) / (bulbsPerSwag + 0.2);
        // Quadratic Bézier formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const bx = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * midX + Math.pow(t, 2) * endX;
        const by = Math.pow(1 - t, 2) * 10 + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * 10;

        // Tangent angle to tilt bulb naturally along wire
        const tx = 2 * (1 - t) * (midX - startX) + 2 * t * (endX - midX);
        const ty = 2 * (1 - t) * (controlY - 10) + 2 * t * (10 - controlY);
        // Perpendicular angle for gravity pull
        const wireAngle = Math.atan2(ty, tx);
        const hangAngle = wireAngle * 0.35; // hang down with slight wire tilt

        const colorKey = activePaletteKeys[(i * bulbsPerSwag + b) % activePaletteKeys.length];
        const colorData = BULB_COLORS[colorKey] || BULB_COLORS.gold;

        generatedBulbs.push({
          id: `top-${i}-${b}`,
          x: bx,
          y: by,
          angle: hangAngle * (180 / Math.PI),
          color: colorData,
          // Staggered twinkle animations
          twinkleDuration: 2.2 + ((b * 7 + i * 3) % 5) * 0.45,
          twinkleDelay: ((b * 3 + i * 5) % 11) * 0.35,
          // Wave timing index
          waveIndex: i * bulbsPerSwag + b,
        });
      }
    }

    // Optional Decorative Side Drape for Desktop/Tablet (Left Edge)
    let sidePathD = '';
    if (!isMobile && currentStep !== 3) {
      // Graceful cascading side string hanging down left border
      const sideH = Math.min(dimensions.height * 0.55, 420);
      sidePathD = `M 15,10 Q 32,${sideH * 0.3} 18,${sideH * 0.6} Q 8,${sideH * 0.85} 22,${sideH}`;

      const sideBulbCount = 8;
      for (let s = 0; s < sideBulbCount; s++) {
        const st = (s + 0.5) / sideBulbCount;
        const sy = 10 + st * sideH;
        const sx = 18 + Math.sin(st * Math.PI * 2) * 10;

        const colorKey = activePaletteKeys[(s * 3) % activePaletteKeys.length];
        const colorData = BULB_COLORS[colorKey] || BULB_COLORS.gold;

        generatedBulbs.push({
          id: `side-${s}`,
          x: sx,
          y: sy,
          angle: (Math.sin(st * Math.PI) * 18),
          color: colorData,
          twinkleDuration: 2.5 + (s % 4) * 0.5,
          twinkleDelay: (s * 0.6),
          waveIndex: s + 20,
        });
      }
    }

    // Corner festive flourish for Step 1 & Step 5 (Right Corner)
    if (!isMobile && (currentStep === 1 || currentStep === 5)) {
      const cornerBulbCount = 5;
      for (let c = 0; c < cornerBulbCount; c++) {
        const ct = (c + 0.5) / cornerBulbCount;
        const cy = 10 + ct * 180;
        const cx = w - (20 + Math.sin(ct * Math.PI) * 12);

        const colorKey = activePaletteKeys[(c * 2) % activePaletteKeys.length];
        const colorData = BULB_COLORS[colorKey] || BULB_COLORS.gold;

        generatedBulbs.push({
          id: `corner-${c}`,
          x: cx,
          y: cy,
          angle: -(Math.sin(ct * Math.PI) * 18),
          color: colorData,
          twinkleDuration: 2.6 + (c % 3) * 0.4,
          twinkleDelay: (c * 0.5 + 1.2),
          waveIndex: c + 35,
        });
      }
    }

    return { topSwags: pathD, sideDrape: sidePathD, bulbs: generatedBulbs };
  }, [dimensions, currentStep, isMobile, isTablet]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {/* SVG Container for Physical Black Wire Swags */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
      >
        <defs>
          {/* Subtle gradient for realistic physical copper/PVC wire */}
          <linearGradient id="wireGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Top Swag Wire String */}
        <motion.path
          d={topSwags}
          fill="none"
          stroke="url(#wireGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            y: [0, 1.2, 0], // Extremely subtle, natural wire float
          }}
          transition={{
            pathLength: { duration: 1.2, ease: 'easeOut' },
            opacity: { duration: 0.6 },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Side Drape Wire String (Desktop) */}
        {sideDrape && (
          <motion.path
            d={sideDrape}
            fill="none"
            stroke="url(#wireGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </svg>

      {/* Individual Realistically Rendered LED Bulbs */}
      {bulbs.map((bulb) => (
        <div
          key={bulb.id}
          className="absolute"
          style={{
            left: bulb.x,
            top: bulb.y,
            transform: `translate(-50%, 0) rotate(${bulb.angle}deg)`,
          }}
        >
          {/* 1. Dark Socket / Plug (where bulb clamps to wire) */}
          <div
            className="w-2 h-2.5 mx-auto bg-neutral-900 border border-neutral-800 rounded-t-sm shadow-sm"
            style={{
              background: 'linear-gradient(to right, #1f2937, #030712, #1f2937)',
            }}
          />

          {/* 2. Realistic Teardrop LED Bulb Envelope & Glow */}
          <motion.div
            className="relative -mt-0.5"
            initial={{ opacity: 0.7 }}
            animate={{
              // Natural independent twinkling with occasional wave pulse
              opacity: [0.72, 1, 0.78, 0.95, 0.72],
              scale: [0.97, 1.03, 0.98, 1.02, 0.97],
            }}
            transition={{
              duration: bulb.twinkleDuration,
              repeat: Infinity,
              delay: bulb.twinkleDelay,
              ease: 'easeInOut',
            }}
          >
            {/* Outer Transparent Radiant Emission Aura with Sequential Chase Wave */}
            <motion.div
              className="absolute -inset-3 rounded-full pointer-events-none blur-md"
              animate={{
                opacity: [0.3, 0.9, 0.45, 0.3],
                scale: [0.9, 1.3, 1.0, 0.9],
              }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                delay: (bulb.waveIndex * 0.11) % 3.6,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: bulb.color.outer,
              }}
            />

            {/* Inner Vibrant Glow Aura */}
            <div
              className="absolute -inset-1 rounded-full pointer-events-none blur-xs"
              style={{
                backgroundColor: bulb.color.glow,
              }}
            />

            {/* Realistic Faceted / Pointed Oval Bulb Glass */}
            <svg
              width="11"
              height="16"
              viewBox="0 0 11 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 overflow-visible"
            >
              <defs>
                {/* 3D Glass Surface Shading */}
                <linearGradient id={`bulbGrad-${bulb.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="25%" stopColor={bulb.color.hex} />
                  <stop offset="100%" stopColor={bulb.color.hex} stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Glass Teardrop Shape */}
              <path
                d="M 2.2,0 
                   C 1.2,3.5 0.5,6.5 1.5,10.5 
                   C 2.2,13.2 4.0,15.5 5.5,15.5 
                   C 7.0,15.5 8.8,13.2 9.5,10.5 
                   C 10.5,6.5 9.8,3.5 8.8,0 Z"
                fill={`url(#bulbGrad-${bulb.id})`}
                stroke={bulb.color.hex}
                strokeWidth="0.5"
                filter={`drop-shadow(0 0 6px ${bulb.color.glow})`}
              />

              {/* Incandescent Hot White Filament Core inside glass */}
              <ellipse
                cx="5.5"
                cy="7.5"
                rx="1.2"
                ry="3.2"
                fill="#ffffff"
                opacity="0.9"
              />

              {/* Delicate glass specular highlight reflection */}
              <path
                d="M 3.2,3 C 2.8,5.5 2.8,8.5 3.5,10.5"
                stroke="#ffffff"
                strokeWidth="0.75"
                strokeLinecap="round"
                opacity="0.65"
              />
            </svg>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
