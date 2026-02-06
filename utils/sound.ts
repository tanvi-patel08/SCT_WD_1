class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private ambientNodes: { gain: GainNode; nodes: AudioNode[] } | null = null;
  private isAmbientActive: boolean = false;

  constructor() {
    // We don't initialize immediately to avoid browser warnings about AudioContext
    // before user interaction. We'll init on first play.
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  private ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAmbientNodes();
    } else {
      this.playClick();
      if (this.isAmbientActive) {
        this.createAmbientNodes();
      }
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  startAmbient() {
    this.isAmbientActive = true;
    if (!this.muted) {
      this.createAmbientNodes();
    }
  }

  private createAmbientNodes() {
    if (this.ambientNodes) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 3); // Slow fade in

    // 1. Deep Drone (Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55; // A1 approx
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.4;
    osc1.connect(osc1Gain);
    osc1Gain.connect(masterGain);
    osc1.start();

    // 2. Detuned Drone (Triangle) for texture
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 57; // Slight beat frequency
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.15;
    osc2.connect(osc2Gain);
    osc2Gain.connect(masterGain);
    osc2.start();

    // 3. High Ethereal Shimmer
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 220; // A3
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.05;
    osc3.connect(osc3Gain);
    osc3Gain.connect(masterGain);
    osc3.start();

    // 4. Filtered Noise (Space Wind)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 300;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;
    
    // LFO for noise filter (Wind variation)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Slow cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200; // Modulate frequency by +/- 200Hz
    lfo.connect(lfoGain);
    lfoGain.connect(noiseFilter.frequency);
    lfo.start();

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    this.ambientNodes = {
      gain: masterGain,
      nodes: [osc1, osc1Gain, osc2, osc2Gain, osc3, osc3Gain, noise, noiseFilter, noiseGain, lfo, lfoGain]
    };
  }

  private stopAmbientNodes() {
    if (!this.ambientNodes) return;
    const ctx = this.ctx;
    if (!ctx) return;

    const { gain, nodes } = this.ambientNodes;
    
    // Fade out
    try {
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    } catch(e) {
        // Ignore if value setting fails
    }

    setTimeout(() => {
      nodes.forEach(node => {
        try {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
                node.stop();
            }
            node.disconnect();
        } catch(e) {
            // Ignore already stopped nodes
        }
      });
      gain.disconnect();
    }, 1500);

    this.ambientNodes = null;
  }

  // High-pitched blip for UI interaction
  playClick() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // Gentle tick for hovers (optional usage)
  playHover() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime); // Lower volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Whooshing noise for transitions
  playTransition() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // Warp/Open sound for Modals
  playOpen() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  // Success chord for landing
  playSuccess() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // C Major Triad (C5, E5, G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => { 
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        
        gain.gain.setValueAtTime(0.05, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 1.5);
        
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 1.5);
    });
  }
}

export const soundManager = new SoundManager();