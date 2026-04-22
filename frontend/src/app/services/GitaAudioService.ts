'use client';

class GitaAudioService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentAudio: HTMLAudioElement | null = null;

  private getUrl(chapter: number): string {
    // Handling the user's naming convention (Chapter 1 and 3 are lowercase in filenames)
    const cLabel = (chapter === 1 || chapter === 3) ? 'chapter' : 'Chapter';
    return `/audio/orignal/Bhagavad Gita- ${cLabel} ${chapter}.mp3`;
  }

  /**
   * Preloads a chapter audio file into memory.
   */
  preloadChapter(chapter: number) {
    const url = this.getUrl(chapter);
    if (this.audioCache.has(url)) return;

    const audio = new Audio(url);
    audio.preload = 'auto';
    this.audioCache.set(url, audio);
  }

  /**
   * Plays the chapter audio with zero latency if preloaded.
   */
  async playChapter(chapter: number, onEnd: () => void, onTimeUpdate?: (current: number, duration: number) => void) {
    this.stop();

    const url = this.getUrl(chapter);
    let audio = this.audioCache.get(url);

    if (!audio) {
      audio = new Audio(url);
      this.audioCache.set(url, audio);
    }

    audio.onended = onEnd;
    if (onTimeUpdate) {
      audio.ontimeupdate = () => onTimeUpdate(audio!.currentTime, audio!.duration);
    }

    this.currentAudio = audio;
    
    try {
      await audio.play();
      if (chapter < 18) this.preloadChapter(chapter + 1);
    } catch (err) {
      console.warn(`Original voice for Ch ${chapter} not found at ${url}`, err);
      throw err;
    }
  }

  seek(seconds: number) {
    if (this.currentAudio) {
      this.currentAudio.currentTime = seconds;
    }
  }

  getCurrentTime() {
    return this.currentAudio?.currentTime || 0;
  }

  getDuration() {
    return this.currentAudio?.duration || 0;
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.ontimeupdate = null;
      this.currentAudio = null;
    }
  }

  setVolume(val: number) {
    if (this.currentAudio) this.currentAudio.volume = val;
  }
}

export const audioService = new GitaAudioService();
