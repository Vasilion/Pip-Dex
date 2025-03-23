"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/utils/sound";

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    const newMutedState = soundManager.toggleMute();
    setMuted(newMutedState);

    if (!newMutedState) {
      soundManager.play("ui-click");
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="flex items-center justify-center w-8 h-8 border border-emerald-500/50 hover:bg-emerald-900/30 transition-colors"
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? (
        <VolumeX className="h-4 w-4 text-emerald-500" />
      ) : (
        <Volume2 className="h-4 w-4 text-emerald-500" />
      )}
    </button>
  );
}
