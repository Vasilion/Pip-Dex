class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted = false;
  private volume = 0.5;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
    if (this.isClient) {
      this.preloadSound("ui-click", "/sounds/pipboy-click.wav");
      this.preloadSound("ui-tab", "/sounds/pipboy-tab.wav");
      this.preloadSound("ui-select", "/sounds/pipboy-select.wav");
      this.preloadSound("ui-deny", "/sounds/pipboy-deny.wav");
    }
  }

  preloadSound(id: string, url: string): void {
    if (!this.isClient) return;

    const audio = new Audio(url);
    audio.volume = this.volume;
    this.sounds.set(id, audio);
  }

  async loadPokemonCry(pokemonId: string): Promise<void> {
    if (!this.isClient) return;

    const id = `pokemon-${pokemonId}`;

    if (this.sounds.has(id)) return;

    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonId}.mp3`;

    try {
      const audio = new Audio(cryUrl);
      audio.volume = this.volume;
      this.sounds.set(id, audio);
    } catch (error) {
      console.error(`Failed to load Pokémon cry for #${pokemonId}:`, error);
    }
  }

  play(id: string, volume?: number): void {
    if (!this.isClient || this.muted) return;

    const sound = this.sounds.get(id);
    if (!sound) {
      console.warn(`Sound "${id}" not found`);
      return;
    }

    // Clone the audio to allow overlapping sounds
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = volume || this.volume;
    clone.play().catch((err) => console.warn("Error playing sound:", err));
  }

  playPokemonCry(pokemonId: string): void {
    if (!this.isClient || this.muted) return;

    const id = `pokemon-${pokemonId}`;

    if (this.sounds.has(id)) {
      this.play(id, 0.18);
      return;
    }

    this.loadPokemonCry(pokemonId).then(() => {
      this.play(id, 0.18);
    });
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));

    if (this.isClient) {
      this.sounds.forEach((sound) => {
        sound.volume = this.volume;
      });
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }
}

let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

export const soundManager =
  typeof window !== "undefined" ? getSoundManager() : new SoundManager();
