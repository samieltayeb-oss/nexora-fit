// 100% Free Bulletproof iOS Safari Compatible Sound & Voice Engine

class SoundEngine {
  private ctx: AudioContext | null = null
  private isUnlocked: boolean = false

  // Unlock iOS AudioContext on first tap
  public unlockAudio() {
    if (typeof window === 'undefined') return
    if (!this.ctx) {
      const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
      const AudioCtx = w.AudioContext || w.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    // Play a tiny silent 0.001s buffer to force-unlock iOS Safari audio channels
    if (this.ctx && !this.isUnlocked) {
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050)
        const source = this.ctx.createBufferSource()
        source.buffer = buffer
        source.connect(this.ctx.destination)
        source.start(0)
        this.isUnlocked = true
      } catch (e) {
        console.error('Audio unlock error:', e)
      }
    }
  }

  private getContext(): AudioContext | null {
    this.unlockAudio()
    return this.ctx
  }

  // Set Complete Chime (C5 -> E5)
  playSetCompleteSound() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12) // E5

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.4)
    } catch (e) {
      console.error('Play sound error:', e)
    }
  }

  // Rest Timer Countdown Tick
  playCountdownTickSound() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(880, now) // A5

      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch (e) {
      console.error('Tick sound error:', e)
    }
  }

  // Workout Victory Fanfare
  playVictoryFanfareSound() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.12
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        gain.gain.setValueAtTime(0.25, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.5)
      })
    } catch (e) {
      console.error('Fanfare error:', e)
    }
  }

  // High-Quality Spoken Voice Engine (iOS Safari Compatible)
  speakText(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd()
      return
    }

    this.unlockAudio()

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen') || v.name.includes('Google')))
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onend = () => {
        if (onEnd) onEnd()
      }
      utterance.onerror = (e) => {
        console.error('Speech error:', e)
        if (onEnd) onEnd()
      }

      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.error('Speak error:', e)
      if (onEnd) onEnd()
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}

export const soundEngine = new SoundEngine()
