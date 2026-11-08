import { motion } from 'framer-motion';

export default function DiyaGraphic({
  isLit = true,
  size = 'md',
  onClick,
  interactive = false,
  className = '',
  glowIntensity = 'normal', // 'soft', 'normal', 'high'
}) {
  // Dimension mapping
  const sizeMap = {
    sm: { width: 64, height: 56, scale: 0.6 },
    md: { width: 120, height: 105, scale: 1 },
    lg: { width: 180, height: 160, scale: 1.5 },
    xl: { width: 260, height: 230, scale: 2.1 },
  };

  const { width, height } = sizeMap[size] || sizeMap.md;

  const glowColors = {
    soft: 'rgba(251, 191, 36, 0.3)',
    normal: 'rgba(245, 158, 11, 0.55)',
    high: 'rgba(251, 191, 36, 0.85)',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      style={{ width, height }}
    >
      {/* Background radial aura when lit */}
      {isLit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.6, 0.85, 0.65],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[25%] left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{
            width: width * 1.5,
            height: width * 1.5,
            background: `radial-gradient(circle, ${glowColors[glowIntensity]} 0%, rgba(245, 158, 11, 0.15) 50%, rgba(0,0,0,0) 75%)`,
            filter: 'blur(16px)',
          }}
        />
      )}

      {/* SVG Diya Graphic */}
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full overflow-visible drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame Gradients */}
          <radialGradient id="flameOuter" cx="50%" cy="60%" r="55%">
            <stop offset="0%" stop-color="#fff59d" />
            <stop offset="35%" stop-color="#f59e0b" />
            <stop offset="70%" stop-color="#ea580c" />
            <stop offset="100%" stop-color="#b91c1c" stop-opacity="0.8" />
          </radialGradient>

          <linearGradient id="flameInner" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="40%" stop-color="#fef08a" />
            <stop offset="85%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>

          {/* Diya Terracotta / Brass Gradients */}
          <linearGradient id="clayBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d97706" />
            <stop offset="30%" stop-color="#b45309" />
            <stop offset="70%" stop-color="#78350f" />
            <stop offset="100%" stop-color="#451a03" />
          </linearGradient>

          <linearGradient id="lipHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#92400e" />
            <stop offset="25%" stop-color="#fde68a" />
            <stop offset="50%" stop-color="#f59e0b" />
            <stop offset="75%" stop-color="#fde68a" />
            <stop offset="100%" stop-color="#92400e" />
          </linearGradient>

          {/* Golden base ring gradient */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ca8a04" />
            <stop offset="50%" stop-color="#fef08a" />
            <stop offset="100%" stop-color="#a16207" />
          </linearGradient>

          {/* Filter for glowing flicker */}
          <filter id="flameGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Diya Base Shadow */}
        <ellipse
          cx="80"
          cy="128"
          rx="58"
          ry="10"
          fill="#000000"
          opacity="0.5"
          filter="blur(5px)"
        />

        {/* ================= FLAME (Only rendered when lit) ================= */}
        {isLit ? (
          <g className="flame-pulse" filter="url(#flameGlowFilter)">
            {/* Outer flame body */}
            <path
              d="M80 15 
                 C88 32 102 46 99 68 
                 C96 82 86 86 80 86 
                 C74 86 64 82 61 68 
                 C58 46 72 32 80 15 Z"
              fill="url(#flameOuter)"
              opacity="0.95"
            />

            {/* Inner intense flame */}
            <path
              d="M80 25 
                 C85 38 94 48 91 66 
                 C89 77 82 81 80 81 
                 C78 81 71 77 69 66 
                 C66 48 75 38 80 25 Z"
              fill="url(#flameInner)"
            />

            {/* Flame white-hot core */}
            <ellipse cx="80" cy="62" rx="4.5" ry="12" fill="#ffffff" opacity="0.95" />

            {/* Blue base spark */}
            <ellipse cx="80" cy="79" rx="5" ry="3" fill="#38bdf8" opacity="0.75" />

            {/* Little floating spark particles */}
            <circle cx="78" cy="12" r="1.5" fill="#fef08a" opacity="0.8" />
            <circle cx="83" cy="8" r="1.2" fill="#ffffff" opacity="0.9" />
          </g>
        ) : (
          /* Unlit wick with gentle smoke wisps */
          <g>
            <motion.path
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{
                d: [
                  "M80 75 Q78 55 82 40 Q85 30 81 20",
                  "M80 75 Q82 55 78 40 Q75 30 79 20",
                  "M80 75 Q78 55 82 40 Q85 30 81 20",
                ],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Cotton Wick */}
        <path
          d="M79 73 Q80 81 80 84 Q81 81 81 73 Z"
          fill={isLit ? "#451a03" : "#334155"}
          stroke={isLit ? "#ea580c" : "#1e293b"}
          strokeWidth="0.8"
        />

        {/* ================= DIYA CLAY BODY ================= */}
        {/* Main Diya Bowl */}
        <path
          d="M20 84 
             C24 114 52 126 80 126 
             C108 126 136 114 140 84 
             C141 80 134 78 124 81 
             C110 85 96 87 80 87 
             C64 87 50 85 36 81 
             C26 78 19 80 20 84 Z"
          fill="url(#clayBase)"
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Diya Lip / Rim Ellipse */}
        <ellipse
          cx="80"
          cy="83"
          rx="58"
          ry="11"
          fill="url(#lipHighlight)"
        />

        {/* Oil reservoir inside */}
        <ellipse
          cx="80"
          cy="84"
          rx="48"
          ry="7"
          fill="#451a03"
          opacity="0.85"
        />
        {isLit && (
          <ellipse
            cx="80"
            cy="84"
            rx="38"
            ry="4.5"
            fill="#d97706"
            opacity="0.6"
          />
        )}

        {/* Decorative Auspicious Rim Dots */}
        {[28, 38, 50, 64, 80, 96, 110, 122, 132].map((xPos, idx) => (
          <circle
            key={idx}
            cx={xPos}
            cy={82 + Math.sin((idx / 8) * Math.PI) * 4}
            r="1.8"
            fill="url(#goldRim)"
            stroke="#78350f"
            strokeWidth="0.5"
          />
        ))}

        {/* Traditional Petal / Peacock Flute Carving on Bowl Front */}
        <path
          d="M50 96 Q80 118 110 96"
          stroke="#f59e0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        <path
          d="M60 104 Q80 120 100 104"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <circle cx="80" cy="107" r="2.5" fill="#fef08a" opacity="0.9" />

        {/* Diya Base Stand */}
        <path
          d="M60 125 C70 128 90 128 100 125 L96 130 C88 132 72 132 64 130 Z"
          fill="#451a03"
        />
      </svg>
    </div>
  );
}
