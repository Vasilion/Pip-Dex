class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted = false;
  private volume = 0.5;
  private isClient: boolean;

  constructor() {
    // Check if we're in a browser environment
    this.isClient = typeof window !== "undefined";

    // Only preload sounds if in browser
    if (this.isClient) {
      // Pre-load common sounds
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

  async loadPokemonCry(pokemonId: number): Promise<void> {
    if (!this.isClient) return;

    const id = `pokemon-${pokemonId}`;

    // If already loaded, don't reload
    if (this.sounds.has(id)) return;

    // Use the PokéAPI cry URL format
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonId}.mp3`;

    try {
      const audio = new Audio(cryUrl);
      audio.volume = this.volume;
      this.sounds.set(id, audio);
    } catch (error) {
      console.error(`Failed to load Pokémon cry for #${pokemonId}:`, error);
    }
  }

  play(id: string): void {
    if (!this.isClient || this.muted) return;

    const sound = this.sounds.get(id);
    if (!sound) {
      console.warn(`Sound "${id}" not found`);
      return;
    }

    // Clone the audio to allow overlapping sounds
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = this.volume;
    clone.play().catch((err) => console.warn("Error playing sound:", err));
  }

  playPokemonCry(pokemonId: number): void {
    if (!this.isClient || this.muted) return;

    const id = `pokemon-${pokemonId}`;

    // If the cry is already loaded, play it
    if (this.sounds.has(id)) {
      this.play(id);
      return;
    }

    // Otherwise, load and play
    this.loadPokemonCry(pokemonId).then(() => {
      this.play(id);
    });
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));

    // Update volume for all loaded sounds
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

// Create a singleton instance, but ensure it's only created once
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

// For backward compatibility
export const soundManager =
  typeof window !== "undefined" ? getSoundManager() : new SoundManager();
