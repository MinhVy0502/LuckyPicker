/**
 * LuckyPicker Pro - Web Audio Sound Synthesizer Engine
 * High performance synthetic audio effects without external MP3 files.
 */
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('app_sound_muted') === 'true';
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('app_sound_muted', this.isMuted);
    return this.isMuted;
  }

  // Short mechanical click/tick for wheel & slot machine
  playTick(pitch = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 * pitch, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn(e);
    }
  }

  // Victory fanfare for winners
  playWinFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C, E, G, C5, E5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.35);
        } catch (e) {}
      }, idx * 60);
    });
  }

  // Pop sound for cards or items
  playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // Coin flip metallic bell & ring
  playCoinToss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  // Dice roll shaker
  playDiceRoll() {
    if (this.isMuted) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playTick(1.2 + Math.random() * 0.8), i * 70);
    }
  }

  // Shuffle swoosh
  playShuffle() {
    if (this.isMuted) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playTick(0.8 + Math.random() * 0.5), i * 40);
    }
  }
}

window.soundEngine = new SoundEngine();
