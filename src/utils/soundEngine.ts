// Web Audio API Synthesizer & Sound FX Engine

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  private initCtx() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBgm();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Play a gentle bubble click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore audio context errors
    }
  }

  // Play a soft magic chime (major 7th chord sparkle)
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.95);
      });
    } catch {
      // Ignore
    }
  }

  // Play celebration fanfare
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      // Ascending triumphant melody
      const notes = [
        { f: 523.25, d: 0.12, delay: 0 },    // C5
        { f: 659.25, d: 0.12, delay: 0.12 }, // E5
        { f: 783.99, d: 0.12, delay: 0.24 }, // G5
        { f: 1046.50, d: 0.45, delay: 0.36 } // C6
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.delay);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + n.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.delay);
        osc.stop(ctx.currentTime + n.delay + n.d + 0.05);
      });
    } catch {
      // Ignore
    }
  }

  // Play error / cute boing
  public playError() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Ignore
    }
  }

  // Candle blow whoosh
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      // White noise buffer for whoosh
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.55);
    } catch {
      // Ignore
    }
  }

  // Play complete "Happy Birthday to you" song synthesized in dreamy music-box / bell tone
  public playHappyBirthdaySong() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Happy birthday melody notes & durations (in seconds)
    // Key of F Major: C4, C4, D4, C4, F4, E4 ...
    const melody = [
      { f: 261.63, d: 0.35, pause: 0.05 }, // Hap-
      { f: 261.63, d: 0.35, pause: 0.05 }, // py
      { f: 293.66, d: 0.7, pause: 0.1 },  // Birth-
      { f: 261.63, d: 0.7, pause: 0.1 },  // day
      { f: 349.23, d: 0.7, pause: 0.1 },  // to
      { f: 329.63, d: 1.2, pause: 0.2 },  // you

      { f: 261.63, d: 0.35, pause: 0.05 }, // Hap-
      { f: 261.63, d: 0.35, pause: 0.05 }, // py
      { f: 293.66, d: 0.7, pause: 0.1 },  // Birth-
      { f: 261.63, d: 0.7, pause: 0.1 },  // day
      { f: 392.00, d: 0.7, pause: 0.1 },  // to
      { f: 349.23, d: 1.2, pause: 0.2 },  // you

      { f: 261.63, d: 0.35, pause: 0.05 }, // Hap-
      { f: 261.63, d: 0.35, pause: 0.05 }, // py
      { f: 523.25, d: 0.7, pause: 0.1 },  // Birth-
      { f: 440.00, d: 0.7, pause: 0.1 },  // day
      { f: 349.23, d: 0.7, pause: 0.1 },  // dear
      { f: 329.63, d: 0.7, pause: 0.1 },  // Har-
      { f: 293.66, d: 1.2, pause: 0.2 },  // shu

      { f: 466.16, d: 0.35, pause: 0.05 }, // Hap-
      { f: 466.16, d: 0.35, pause: 0.05 }, // py
      { f: 440.00, d: 0.7, pause: 0.1 },  // Birth-
      { f: 349.23, d: 0.7, pause: 0.1 },  // day
      { f: 392.00, d: 0.7, pause: 0.1 },  // to
      { f: 349.23, d: 1.8, pause: 0.3 }   // you!
    ];

    let currentTime = ctx.currentTime + 0.1;

    melody.forEach(note => {
      // Main music box note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, currentTime);

      // Harmony chime 1 octave above with slight dampening
      const oscHarmonic = ctx.createOscillator();
      const gainHarmonic = ctx.createGain();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(note.f * 2, currentTime);

      gain.gain.setValueAtTime(0.001, currentTime);
      gain.gain.linearRampToValueAtTime(0.16, currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.d);

      gainHarmonic.gain.setValueAtTime(0.001, currentTime);
      gainHarmonic.gain.linearRampToValueAtTime(0.06, currentTime + 0.02);
      gainHarmonic.gain.exponentialRampToValueAtTime(0.001, currentTime + note.d * 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      oscHarmonic.connect(gainHarmonic);
      gainHarmonic.connect(ctx.destination);

      osc.start(currentTime);
      osc.stop(currentTime + note.d + 0.05);

      oscHarmonic.start(currentTime);
      oscHarmonic.stop(currentTime + note.d + 0.05);

      currentTime += note.d + note.pause;
    });
  }

  // Continuous dreamy ambient background loop
  public startLofiBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.isBgmPlaying = true;
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + i * 0.15 + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.15 + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 3.3);
      });
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, 3500);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startLofiBgm();
      return true;
    }
  }

  public getIsBgmPlaying() {
    return this.isBgmPlaying;
  }
}

export const soundEngine = new SoundEngine();
