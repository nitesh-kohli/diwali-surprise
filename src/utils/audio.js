/**
 * Web Audio API synthesizer for ambient romantic music and gentle sound effects.
 * 100% self-contained, no external MP3 dependencies, works cross-platform.
 */

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.ambientInterval = null;
    this.isMuted = false;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMusic() {
    this.init();
    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  playChimeNote(freq, duration = 2.5, type = 'sine', gainVal = 0.25) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio error silently handled
    }
  }

  // Sound effect when lighting a Diya
  playDiyaIgniteSound() {
    this.init();
    if (!this.ctx) return;
    // Harmonic bell chord
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChimeNote(freq, 2.8, 'sine', 0.2);
      }, idx * 75);
    });
  }

  // Sound effect for page transition / magic
  playMagicChime() {
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChimeNote(freq, 2.0, 'sine', 0.15);
      }, idx * 60);
    });
  }

  // Soft sparkle firework burst sound
  playFireworkBurst() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise burst for spark
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 400, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      noise.start(now);

      // Sweet trailing chime
      setTimeout(() => {
        this.playChimeNote(659.25 + Math.random() * 300, 1.2, 'triangle', 0.09);
      }, 80);
    } catch {
      // Audio error silently handled
    }
  }

  // Romantic ambient loop (soft meditative pentatonic bells with warm low hum)
  startAmbient() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Soothing pentatonic scale (D Indian / Raag Bhupali vibe - peaceful, auspicious)
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99];

    // Play a gentle initial note
    this.playChimeNote(293.66, 4.0, 'sine', 0.18);
    this.playChimeNote(440.0, 4.5, 'triangle', 0.12);

    let step = 0;
    this.ambientInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const note = scale[Math.floor(Math.random() * scale.length)];
      const duration = 2.5 + Math.random() * 2.0;
      this.playChimeNote(note, duration, Math.random() > 0.5 ? 'sine' : 'triangle', 0.12);

      // Occasional gentle low root drone
      if (step % 4 === 0) {
        this.playChimeNote(146.83, 5.0, 'sine', 0.14); // Low D
      }
      step++;
    }, 1800);
  }

  stopAmbient() {
    this.isPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const audioManager = new RomanticAudioManager();
