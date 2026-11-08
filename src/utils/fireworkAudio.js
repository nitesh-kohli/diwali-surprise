/**
 * Authentic Firework Sound Engine using Web Audio API synthesis.
 * Realistic rocket motor launch whistles, sub-bass explosion shockwaves,
 * multi-layered shell rumbles, willow shimmers, and micro crackle clusters.
 * 100% royalty-free, zero latency, zero CORS, mobile autoplay compliant.
 */

class FireworkAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.85;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx && AudioContext) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.initialized = true;
    } catch {
      // Audio not supported or blocked
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --- 1. Realistic Rocket Motor Launch Whistle ---
  playLaunchWhistle(duration = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Noise hiss of rocket exhaust
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(500, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1550, now + duration * 0.95);
      noiseFilter.Q.setValueAtTime(5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.14, now + duration * 0.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noiseSource.start(now);
      noiseSource.stop(now + duration);

      // Swept whistle tone (classic mortar scream)
      const whistleOsc = this.ctx.createOscillator();
      whistleOsc.type = 'triangle';
      whistleOsc.frequency.setValueAtTime(420, now);
      whistleOsc.frequency.exponentialRampToValueAtTime(1450, now + duration);

      const whistleGain = this.ctx.createGain();
      whistleGain.gain.setValueAtTime(0.001, now);
      whistleGain.gain.linearRampToValueAtTime(0.09, now + duration * 0.5);
      whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      whistleOsc.connect(whistleGain);
      whistleGain.connect(this.masterGain);

      whistleOsc.start(now);
      whistleOsc.stop(now + duration);
    } catch {
      // Audio handled
    }
  }

  // --- 2. Realistic Firework Explosion Sounds ---
  playExplosion(type = 'peony') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const isFinale = type === 'finale';
      const isWillow = type === 'willow' || type === 'golden_willow';
      const isCrackling = type === 'crackling' || type === 'golden_crackling';
      const isChrysanthemum = type === 'chrysanthemum';

      // 1. Sub-bass shockwave thump
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      const startPitch = isFinale ? 190 : isWillow ? 125 : 155;
      subOsc.frequency.setValueAtTime(startPitch, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.24);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(isFinale ? 0.55 : 0.42, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);

      subOsc.start(now);
      subOsc.stop(now + 0.4);

      // 2. Heavy lowpass explosion rumble / air blast
      const rumbleDuration = isFinale ? 2.5 : isWillow ? 2.4 : 1.7;
      const bufferSize = Math.floor(this.ctx.sampleRate * rumbleDuration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.95;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(isFinale ? 700 : isChrysanthemum ? 550 : 420, now);
      lowFilter.frequency.exponentialRampToValueAtTime(80, now + rumbleDuration);

      const rumbleGain = this.ctx.createGain();
      rumbleGain.gain.setValueAtTime(isFinale ? 0.38 : 0.28, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + rumbleDuration);

      noiseSource.connect(lowFilter);
      lowFilter.connect(rumbleGain);
      rumbleGain.connect(this.masterGain);

      noiseSource.start(now);
      noiseSource.stop(now + rumbleDuration);

      // 3. Crackles or Willow Shimmers
      if (isCrackling || isChrysanthemum || isFinale) {
        this.playCrackles(now + 0.22, isFinale ? 18 : 10);
      } else if (isWillow) {
        this.playWillowShimmer(now + 0.25);
      }
    } catch {
      // Audio handled
    }
  }

  // Clustered high-frequency crackle pops
  playCrackles(startTime, count = 12) {
    if (!this.ctx || this.isMuted) return;

    for (let i = 0; i < count; i++) {
      const clickTime = startTime + Math.random() * 0.75;
      const clickDuration = 0.025 + Math.random() * 0.035;
      const clickBuf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * clickDuration), this.ctx.sampleRate);
      const ch = clickBuf.getChannelData(0);
      for (let j = 0; j < ch.length; j++) {
        ch[j] = Math.random() * 2 - 1;
      }

      const src = this.ctx.createBufferSource();
      src.buffer = clickBuf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2600 + Math.random() * 2200, clickTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.14 + Math.random() * 0.08, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + clickDuration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start(clickTime);
      src.stop(clickTime + clickDuration);
    }
  }

  // Delicate golden willow shimmer
  playWillowShimmer(startTime) {
    if (!this.ctx || this.isMuted) return;

    const shimmerNotes = [1150, 1420, 1780, 2150, 2600, 3100];
    shimmerNotes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.14 + Math.random() * 0.1;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + Math.random() * 120, noteTime);

      gain.gain.setValueAtTime(0.035, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.75);
    });
  }

  // Continuous authentic Diwali fuljhadi (sparkler) crackle fizzle
  startSparklerCrackles() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.sparklerInterval) return;

    this.sparklerInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      this.playCrackles(this.ctx.currentTime, 5);
    }, 110);
  }

  stopSparklerCrackles() {
    if (this.sparklerInterval) {
      clearInterval(this.sparklerInterval);
      this.sparklerInterval = null;
    }
  }
}

export const fireworkAudio = new FireworkAudioEngine();
