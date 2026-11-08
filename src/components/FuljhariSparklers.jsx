import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { fireworkAudio } from '../utils/fireworkAudio';

const FuljhariSparklers = forwardRef(function FuljhariSparklers({ onLightChange }, ref) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sparklersRef = useRef([]);
  const sparksRef = useRef([]);
  const smokeRef = useRef([]);

  const [, setTriggerRender] = useState(0);

  // Expose trigger methods
  useImperativeHandle(ref, () => ({
    lightAll: () => {
      sparklersRef.current.forEach((sp) => lightOne(sp));
    },
    lightNext: () => {
      const unlit = sparklersRef.current.find((sp) => !sp.isBurning);
      if (unlit) {
        lightOne(unlit);
      } else {
        // Re-ignite the first one
        if (sparklersRef.current.length > 0) {
          lightOne(sparklersRef.current[0]);
        }
      }
    },
    isAnyBurning: () => {
      return sparklersRef.current.some((sp) => sp.isBurning);
    },
  }));

  function lightOne(sparkler) {
    fireworkAudio.init();
    sparkler.isBurning = true;
    sparkler.burnDuration = 480; // ~8 seconds at 60fps
    sparkler.currentBurn = 480;
    fireworkAudio.startSparklerCrackles();

    if (onLightChange) onLightChange(true);
    setTriggerRender((v) => v + 1);
  }

  // Initialize Sparkler Stick Locations
  function setupSparklers(width, height) {
    const isMobile = width < 640;

    sparklersRef.current = [
      // Left Sparkler (angled up-right)
      {
        id: 'left',
        baseX: isMobile ? 30 : 70,
        baseY: height - 15,
        tipX: isMobile ? 85 : 170,
        tipY: height - (isMobile ? 130 : 210),
        isBurning: false,
        burnDuration: 0,
        currentBurn: 0,
        angle: isMobile ? 0.45 : 0.42,
      },
      // Right Sparkler (angled up-left)
      {
        id: 'right',
        baseX: width - (isMobile ? 30 : 70),
        baseY: height - 15,
        tipX: width - (isMobile ? 85 : 170),
        tipY: height - (isMobile ? 130 : 210),
        isBurning: false,
        burnDuration: 0,
        currentBurn: 0,
        angle: isMobile ? -0.45 : -0.42,
      },
    ];
  }

  // Spawn needle starburst sparks from burning tip
  function emitSparksFromTip(x, y) {
    // Fuljhadi color palette: radiant gold, magnesium white, touches of cyan & pink
    const colors = [
      { r: 255, g: 255, b: 255 }, // White-hot
      { r: 255, g: 211, b: 106 }, // Pure Gold
      { r: 255, g: 235, b: 140 }, // Bright Amber Gold
      { r: 255, g: 211, b: 106 },
      { r: 56, g: 189, b: 248 },  // Electric Cyan spark fleck
      { r: 255, g: 64, b: 129 },  // Rose Pink spark fleck
    ];

    const sparksPerFrame = Math.floor(Math.random() * 4 + 7);
    for (let i = 0; i < sparksPerFrame; i++) {
      const angle = Math.random() * Math.PI * 2;
      // High initial needle burst speed
      const speed = Math.random() * 6.5 + 2.5;
      const c = colors[Math.floor(Math.random() * colors.length)];

      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        trail: [],
        maxTrail: 5,
        color: c,
        alpha: 1.0,
        decay: Math.random() * 0.045 + 0.025,
        gravity: 0.08,
        friction: 0.94,
        size: Math.random() * 1.6 + 1.0,
        canBranch: Math.random() > 0.65, // Authentic fuljhadi branching
        hasBranched: false,
      });
    }

    // Occasional subtle wisps of rising smoke
    if (Math.random() > 0.65) {
      smokeRef.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y - 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.4),
        alpha: 0.18,
        decay: 0.005,
        size: Math.random() * 4 + 3,
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    setupSparklers(width, height);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      setupSparklers(width, height);
    };
    window.addEventListener('resize', handleResize);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      let anyStillBurning = false;

      // 1. Draw Sparkler Sticks
      for (const sp of sparklersRef.current) {
        if (sp.isBurning) {
          anyStillBurning = true;
          sp.currentBurn--;
          if (sp.currentBurn <= 0) {
            sp.isBurning = false;
          } else {
            emitSparksFromTip(sp.tipX, sp.tipY);
          }
        }

        // Metallic steel wire handle (bottom section)
        ctx.beginPath();
        ctx.moveTo(sp.baseX, sp.baseY);
        const midX = sp.baseX + (sp.tipX - sp.baseX) * 0.4;
        const midY = sp.baseY + (sp.tipY - sp.baseY) * 0.4;
        ctx.lineTo(midX, midY);
        ctx.strokeStyle = '#71717a';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Dark pyrotechnic chemical coated stick (top section)
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(sp.tipX, sp.tipY);
        ctx.strokeStyle = sp.isBurning ? '#3f3f46' : '#27272a';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // White-hot incandescent burning tip
        if (sp.isBurning) {
          // Soft radial warmth glow
          const glowGrad = ctx.createRadialGradient(sp.tipX, sp.tipY, 0, sp.tipX, sp.tipY, 28);
          glowGrad.addColorStop(0, 'rgba(255, 235, 140, 0.7)');
          glowGrad.addColorStop(0.35, 'rgba(255, 211, 106, 0.3)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(sp.tipX, sp.tipY, 28, 0, Math.PI * 2);
          ctx.fill();

          // Intense burning ember center
          ctx.beginPath();
          ctx.arc(sp.tipX, sp.tipY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        } else {
          // Unlit metallic gray tip with subtle hover hint
          ctx.beginPath();
          ctx.arc(sp.tipX, sp.tipY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#a1a1aa';
          ctx.fill();
        }
      }

      // Check audio status
      if (!anyStillBurning) {
        fireworkAudio.stopSparklerCrackles();
        if (onLightChange) onLightChange(false);
      }

      // 2. Draw Gentle Smoke Wisps
      for (let i = smokeRef.current.length - 1; i >= 0; i--) {
        const sm = smokeRef.current[i];
        sm.x += sm.vx;
        sm.y += sm.vy;
        sm.size += 0.15;
        sm.alpha -= sm.decay;
        if (sm.alpha <= 0) {
          smokeRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 160, 165, ${sm.alpha})`;
        ctx.fill();
      }

      // 3. Draw Needle Sparks with Connected Trails & Branching
      ctx.globalCompositeOperation = 'lighter';
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.trail.push({ x: sp.x, y: sp.y });
        if (sp.trail.length > sp.maxTrail) sp.trail.shift();

        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= sp.friction;
        sp.vy *= sp.friction;
        sp.vy += sp.gravity;
        sp.alpha -= sp.decay;

        // Fuljhadi characteristic branching starburst
        if (sp.canBranch && !sp.hasBranched && sp.alpha < 0.75) {
          sp.hasBranched = true;
          // Spawn 2-3 tiny child crackler needles
          for (let b = 0; b < 2; b++) {
            const bAngle = Math.random() * Math.PI * 2;
            const bSpeed = Math.random() * 2.5 + 1.2;
            sparksRef.current.push({
              x: sp.x,
              y: sp.y,
              vx: Math.cos(bAngle) * bSpeed,
              vy: Math.sin(bAngle) * bSpeed,
              trail: [],
              maxTrail: 3,
              color: sp.color,
              alpha: 0.85,
              decay: 0.06,
              gravity: 0.08,
              friction: 0.92,
              size: sp.size * 0.75,
              canBranch: false,
              hasBranched: true,
            });
          }
        }

        if (sp.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        // Draw glowing needle streak
        if (sp.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(sp.trail[0].x, sp.trail[0].y);
          for (let j = 1; j < sp.trail.length; j++) {
            ctx.lineTo(sp.trail[j].x, sp.trail[j].y);
          }
          ctx.strokeStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${sp.alpha})`;
          ctx.lineWidth = sp.size;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // White-hot spark tip
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      fireworkAudio.stopSparklerCrackles();
    };
  }, []);

  // Handle direct tap on the sparkler to light it
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near either sparkler tip
    for (const sp of sparklersRef.current) {
      const dist = Math.hypot(x - sp.tipX, y - sp.tipY);
      const distBase = Math.hypot(x - sp.baseX, y - sp.baseY);
      if (dist < 60 || distBase < 70) {
        lightOne(sp);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="absolute inset-0 w-full h-full pointer-events-auto z-20"
      style={{ touchAction: 'manipulation' }}
    />
  );
});

export default FuljhariSparklers;
