import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { fireworkAudio } from '../utils/fireworkAudio';

// Color definitions with pure RGB for high-performance alpha compositing
const COLOR_DEFS = {
  gold: { r: 255, g: 191, b: 36 },
  goldBright: { r: 255, g: 235, b: 120 },
  amber: { r: 245, g: 158, b: 11 },
  blue: { r: 0, g: 215, b: 255 },
  cyan: { r: 56, g: 189, b: 248 },
  pink: { r: 255, g: 64, b: 129 },
  rose: { r: 244, g: 63, b: 94 },
  purple: { r: 168, g: 85, b: 247 },
  violet: { r: 217, g: 70, b: 239 },
  green: { r: 16, g: 185, b: 129 },
  emerald: { r: 52, g: 211, b: 153 },
  red: { r: 239, g: 68, b: 68 },
  white: { r: 255, g: 255, b: 255 },
};

const STYLES_ORDER = [
  'heart',
  'golden_willow',
  'colourful_peony',
  'chrysanthemum',
  'blue_purple',
  'rainbow',
  'golden_crackling',
];

const FireworksCanvas = forwardRef(function FireworksCanvas(
  { onExplosion, isPlaying = true },
  ref
) {
  const canvasRef = useRef(null);
  const rocketsRef = useRef([]);
  const particlesRef = useRef([]);
  const sparksRef = useRef([]); // rocket ascent sparks
  const flashesRef = useRef([]); // radial illumination glow halos
  const animationFrameRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const styleIndexRef = useRef(0);
  const stateRef = useRef('IDLE');
  const pauseTimerRef = useRef(null);
  const starsRef = useRef([]);

  isPlayingRef.current = isPlaying;

  // Imperative API for Parent Controls
  useImperativeHandle(ref, () => ({
    launchOne: (type = null, targetX = null, targetY = null) => {
      startLaunch(type, targetX, targetY);
    },
    triggerSurprise: () => {
      const surpriseTypes = ['heart', 'golden_willow', 'colourful_peony', 'rainbow', 'golden_crackling'];
      const chosen = surpriseTypes[Math.floor(Math.random() * surpriseTypes.length)];
      startLaunch(chosen);
    },
    triggerFinale: (onComplete) => {
      runGrandFinaleSequence(onComplete);
    },
    clear: () => {
      rocketsRef.current = [];
      particlesRef.current = [];
      sparksRef.current = [];
      flashesRef.current = [];
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      stateRef.current = 'IDLE';
    },
  }));

  // Create faint background stars once
  function initStars(width, height) {
    const stars = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        size: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }
    starsRef.current = stars;
  }

  // --- 1. ROCKET PROJECTILE LAUNCH ---
  function startLaunch(specificType = null, customTargetX = null, customTargetY = null) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const type = specificType || STYLES_ORDER[styleIndexRef.current % STYLES_ORDER.length];
    if (!specificType) {
      styleIndexRef.current += 1;
    }

    const targetX = customTargetX ?? width * (0.24 + Math.random() * 0.52);
    const targetY = customTargetY ?? height * (0.2 + Math.random() * 0.22);

    // Natural launch base near the bottom
    const startX = width * 0.5 + (targetX - width * 0.5) * 0.45 + (Math.random() - 0.5) * 80;
    const startY = height;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Speed scaled for graceful ascent
    const speed = 9.2 + Math.random() * 1.4;
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    rocketsRef.current.push({
      x: startX,
      y: startY,
      vx,
      vy,
      targetX,
      targetY,
      type,
      trail: [],
      gravity: 0.048,
      drag: 0.995,
      color: type === 'heart' ? COLOR_DEFS.pink : COLOR_DEFS.goldBright,
    });

    stateRef.current = 'LAUNCHING';
    fireworkAudio.playLaunchWhistle(0.9);
  }

  // --- 2. EXPLOSION GENERATORS ---
  function explodeRocket(rocket) {
    const { x, y, type } = rocket;
    const isMobile = window.innerWidth < 640;

    // Trigger local sky flash / radial ambient glow halo (just like the reference photo!)
    flashesRef.current.push({
      x,
      y,
      radius: isMobile ? 220 : 340,
      alpha: type === 'heart' ? 0.38 : 0.24,
      decay: 0.0075,
      color: type === 'heart' ? '255, 185, 120' : '255, 215, 110',
    });

    // Play authentic audio
    fireworkAudio.playExplosion(type);

    if (onExplosion) {
      onExplosion({ x, y, type });
    }

    stateRef.current = 'EXPLODING';

    const particles = [];

    if (type === 'heart') {
      // E. HEART FIREWORK (Realistic romantic heart matching reference photo)
      const count = isMobile ? 120 : 180;
      const heartScale = isMobile ? 0.18 : 0.24;

      // Inner white-hot incandescent heart core
      const coreCount = isMobile ? 28 : 45;
      for (let c = 0; c < coreCount; c++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 1.3 + 0.3;
        particles.push({
          x,
          y: y - 4,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          trail: [],
          maxTrail: 8,
          r: 255,
          g: 252,
          b: 240,
          alpha: 1,
          decay: 0.0065,
          gravity: 0.012,
          friction: 0.978,
          size: 2.8,
          hasWhiteCore: true,
          flicker: false,
        });
      }

      // Heart contour boundary particles
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // Parametric heart formula
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const baseSpeed = heartScale * (0.92 + Math.random() * 0.16);
        const vx = hx * baseSpeed;
        const vy = hy * baseSpeed;

        const rand = Math.random();
        let color = COLOR_DEFS.white;
        if (rand > 0.6) {
          color = COLOR_DEFS.pink;
        } else if (rand > 0.3) {
          color = COLOR_DEFS.goldBright;
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          trail: [],
          maxTrail: 16,
          r: color.r,
          g: color.g,
          b: color.b,
          alpha: 1,
          decay: 0.0034,
          gravity: 0.009,
          friction: 0.988,
          size: 2.4,
          hasWhiteCore: true,
          flicker: true,
        });
      }
    } else if (type === 'golden_willow') {
      // A. GOLDEN WILLOW: Cascading golden streams raining downward (matching reference photo)
      const count = isMobile ? 140 : 210;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.3 + 0.6;
        const c = Math.random() > 0.35 ? COLOR_DEFS.gold : COLOR_DEFS.goldBright;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed * 0.95,
          vy: Math.sin(angle) * speed * 0.65 - 0.4,
          trail: [],
          maxTrail: 24, // long continuous golden stream
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: 1,
          decay: 0.003,
          gravity: 0.032, // steady, graceful downward weeping
          friction: 0.985,
          size: 2.2,
          hasWhiteCore: true,
          flicker: true,
        });
      }
    } else if (type === 'colourful_peony') {
      // B. COLOURFUL PEONY: Gentle symmetrical sphere expanding slowly
      const count = isMobile ? 110 : 170;
      const palette = [COLOR_DEFS.rose, COLOR_DEFS.cyan, COLOR_DEFS.emerald, COLOR_DEFS.violet, COLOR_DEFS.gold];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
        const speed = Math.random() * 1.2 + 2.0;
        const c = palette[i % palette.length];
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          maxTrail: 10,
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: 1,
          decay: 0.005 + Math.random() * 0.002,
          gravity: 0.018,
          friction: 0.984,
          size: 2.4,
          hasWhiteCore: true,
          flicker: false,
        });
      }
    } else if (type === 'chrysanthemum') {
      // C. CHRYSANTHEMUM: Dense white/gold core with slow lingering fiery stars
      const innerCount = isMobile ? 30 : 50;
      const outerCount = isMobile ? 80 : 140;

      for (let i = 0; i < innerCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.0 + 0.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          maxTrail: 7,
          r: 255,
          g: 255,
          b: 255,
          alpha: 1,
          decay: 0.01,
          gravity: 0.016,
          friction: 0.976,
          size: 2.6,
          hasWhiteCore: true,
          flicker: false,
        });
      }

      for (let i = 0; i < outerCount; i++) {
        const angle = (i / outerCount) * Math.PI * 2;
        const speed = Math.random() * 1.3 + 2.2;
        const c = Math.random() > 0.5 ? COLOR_DEFS.goldBright : COLOR_DEFS.amber;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          maxTrail: 14,
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: 1,
          decay: 0.0045,
          gravity: 0.022,
          friction: 0.985,
          size: 2.3,
          hasWhiteCore: true,
          flicker: true,
        });
      }
    } else if (type === 'blue_purple') {
      // D. BLUE AND PURPLE EXPLOSION
      const count = isMobile ? 100 : 160;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const isCore = Math.random() > 0.55;
        const speed = isCore ? Math.random() * 1.1 + 0.8 : Math.random() * 1.3 + 2.2;
        const c = isCore ? COLOR_DEFS.blue : COLOR_DEFS.violet;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          maxTrail: 12,
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: 1,
          decay: 0.0048,
          gravity: 0.02,
          friction: 0.985,
          size: isCore ? 2.8 : 2.3,
          hasWhiteCore: isCore,
          flicker: false,
        });
      }
    } else if (type === 'rainbow') {
      // F. RAINBOW EXPLOSION
      const count = isMobile ? 110 : 170;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = Math.random() * 1.2 + 2.0;
        const hue = (angle * 180) / Math.PI;
        const rgb = hslToRgb(hue, 1.0, 0.6);

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          maxTrail: 11,
          r: rgb[0],
          g: rgb[1],
          b: rgb[2],
          alpha: 1,
          decay: 0.005,
          gravity: 0.018,
          friction: 0.984,
          size: 2.4,
          hasWhiteCore: true,
          flicker: false,
        });
      }
    } else if (type === 'golden_crackling') {
      // G. GOLDEN CRACKLING FINALE
      const count = isMobile ? 100 : 160;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 0.8;
        const c = COLOR_DEFS.gold;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          maxTrail: 15,
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: 1,
          decay: 0.0038,
          gravity: 0.026,
          friction: 0.986,
          size: 2.3,
          hasWhiteCore: true,
          flicker: true,
        });
      }

      setTimeout(() => {
        fireworkAudio.playCrackles(fireworkAudio.ctx?.currentTime || 0, 14);
        const crackleCount = 35;
        for (let j = 0; j < crackleCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.6;
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 50,
            y: y + (Math.random() - 0.5) * 50,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            trail: [],
            maxTrail: 6,
            r: 255,
            g: 255,
            b: 255,
            alpha: 1,
            decay: 0.018,
            gravity: 0.02,
            friction: 0.97,
            size: 2.2,
            hasWhiteCore: true,
            flicker: true,
          });
        }
      }, 750);
    }

    particlesRef.current.push(...particles);
  }

  // --- 3. GRAND FINALE SEQUENCE ---
  function runGrandFinaleSequence(onComplete) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    startLaunch('golden_willow', w * 0.48, h * 0.26);

    setTimeout(() => {
      startLaunch('colourful_peony', w * 0.32, h * 0.32);
    }, 1600);

    setTimeout(() => {
      startLaunch('heart', w * 0.5, h * 0.28);
    }, 3200);

    setTimeout(() => {
      startLaunch('golden_crackling', w * 0.65, h * 0.3);
      if (onComplete) {
        setTimeout(onComplete, 2500);
      }
    }, 4800);
  }

  // Helper: HSL to RGB
  function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  // --- 4. MAIN ANIMATION LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    initStars(width, height);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Initial Launch: Recreate the exact reference photo (Heart on left + Golden Willow on right!)
    const initialTimer = setTimeout(() => {
      if (isPlayingRef.current) {
        startLaunch('heart', width * 0.35, height * 0.30);
        setTimeout(() => {
          if (isPlayingRef.current) {
            startLaunch('golden_willow', width * 0.68, height * 0.38);
          }
        }, 500);
      }
    }, 450);

    const render = () => {
      // 1. PURE BLACK NIGHT SKY CLEAR with subtle persistence for optical streaks
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw subtle stationary stars in distant background
      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      }

      // 3. Localized illumination flashes at detonation moments (creates glowing ambient halo)
      for (let fIdx = flashesRef.current.length - 1; fIdx >= 0; fIdx--) {
        const f = flashesRef.current[fIdx];
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        grad.addColorStop(0, `rgba(${f.color}, ${Math.max(0, f.alpha)})`);
        grad.addColorStop(0.35, `rgba(${f.color}, ${Math.max(0, f.alpha * 0.55)})`);
        grad.addColorStop(0.7, `rgba(${f.color}, ${Math.max(0, f.alpha * 0.18)})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();

        f.alpha -= f.decay;
        if (f.alpha <= 0) {
          flashesRef.current.splice(fIdx, 1);
        }
      }

      ctx.globalCompositeOperation = 'lighter';

      // 4. Update & Draw Rocket Ascent
      const rockets = rocketsRef.current;
      for (let rIdx = rockets.length - 1; rIdx >= 0; rIdx--) {
        const rocket = rockets[rIdx];
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 12) rocket.trail.shift();

        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += rocket.gravity;
        rocket.vx *= rocket.drag;
        rocket.vy *= rocket.drag;

        for (let s = 0; s < 2; s++) {
          sparksRef.current.push({
            x: rocket.x + (Math.random() - 0.5) * 2,
            y: rocket.y + Math.random() * 4,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 2 + 1,
            alpha: 0.9,
            decay: 0.045,
            size: Math.random() * 1.5 + 0.8,
            color: rocket.color,
          });
        }

        if (rocket.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
          for (let j = 1; j < rocket.trail.length; j++) {
            ctx.lineTo(rocket.trail[j].x, rocket.trail[j].y);
          }
          ctx.strokeStyle = `rgba(${rocket.color.r}, ${rocket.color.g}, ${rocket.color.b}, 0.85)`;
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        const reachedTarget = rocket.y <= rocket.targetY || rocket.vy >= -1.0;
        if (reachedTarget) {
          explodeRocket(rocket);
          rockets.splice(rIdx, 1);
        }
      }

      // 5. Update & Draw Rocket Ascent Sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;
        if (sp.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${sp.alpha})`;
        ctx.fill();
      }

      // 6. Update & Draw Explosion Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        let currentAlpha = p.alpha;
        if (p.flicker) {
          currentAlpha *= 0.65 + 0.35 * Math.sin(Date.now() * 0.02 + i);
        }

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) {
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
          }
          ctx.strokeStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${Math.max(0, currentAlpha)})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        if (p.hasWhiteCore && currentAlpha > 0.35) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.fill();
        }
      }

      // 7. CINEMATIC PACING (Periodic automatic launches + full touch responsiveness)
      if (
        isPlayingRef.current &&
        rocketsRef.current.length === 0 &&
        particles.length < 25 &&
        stateRef.current !== 'PAUSED_BETWEEN'
      ) {
        stateRef.current = 'PAUSED_BETWEEN';
        pauseTimerRef.current = setTimeout(() => {
          if (isPlayingRef.current) {
            stateRef.current = 'IDLE';
            const isPair = Math.random() > 0.55;
            if (isPair) {
              startLaunch('heart', width * (0.32 + Math.random() * 0.12), height * (0.28 + Math.random() * 0.08));
              setTimeout(() => {
                if (isPlayingRef.current) {
                  startLaunch('golden_willow', width * (0.6 + Math.random() * 0.18), height * (0.32 + Math.random() * 0.1));
                }
              }, 550);
            } else {
              startLaunch();
            }
          }
        }, 2200);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialTimer);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Touch or click anywhere in the night sky to launch a firework directly at that spot!
  const handleTouchLaunch = (e) => {
    if (e.type === 'touchstart') {
      if (e.cancelable) e.preventDefault();
    }
    fireworkAudio.init();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }
    if (clientX === undefined || clientY === undefined) return;

    // Pick a spectacular firework style
    const types = ['heart', 'golden_willow', 'colourful_peony', 'chrysanthemum', 'rainbow', 'golden_crackling'];
    const chosen = types[Math.floor(Math.random() * types.length)];
    startLaunch(chosen, clientX, clientY);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleTouchLaunch}
      onTouchStart={handleTouchLaunch}
      className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none select-none bg-black"
    />
  );
});

export default FireworksCanvas;
