"use client";

import Image from "next/image";
import {
  Heart,
  Shield,
  Zap,
  ArrowLeft,
  ArrowRight,
  Volume2,
} from "lucide-react";
import type { PokemonType } from "@/types/pokemon";
import { soundManager } from "@/utils/sound";
import * as Tooltip from "@radix-ui/react-tooltip";

interface PokemonDetailsProps {
  pokemon: PokemonType;
  allPokemon: PokemonType[];
  onNavigate: (pokemon: PokemonType) => void;
}

export default function PokemonDetails({
  pokemon,
  allPokemon,
  onNavigate,
}: PokemonDetailsProps) {
  const navigateToPokemon = (id: number) => {
    const nextPokemon = allPokemon.find((p) => p.id === id);
    if (nextPokemon) {
      onNavigate(nextPokemon);
    }
  };

  const imageUrl = pokemon.sprites.animated;

  const handleImageClick = () => {
    soundManager.playPokemonCry(pokemon.name);
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const tooltipContent = `${
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  } - #${pokemon.id.toString().padStart(3, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-2">
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={300}>
            <Tooltip.Trigger asChild>
              <div
                className="w-32 h-32 sm:w-48 sm:h-48 relative bg-emerald-900/20 border-2 border-emerald-500/30 flex items-center justify-center cursor-pointer"
                onClick={handleImageClick}
              >
                {imageUrl && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={pokemon.name}
                      fill
                      sizes="(max-width: 640px) 8rem, 12rem"
                      className="object-contain p-2 pixelated"
                      priority
                    />
                  </div>
                )}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-emerald-900 border border-emerald-500 px-3 py-2 text-xs text-white rounded shadow-md z-50 max-w-xs whitespace-pre-line"
                sideOffset={5}
              >
                {tooltipContent}
                <Tooltip.Arrow className="fill-emerald-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <div className="flex items-center mt-2 text-xs text-emerald-500/80">
          <Volume2 className="h-3 w-3 mr-1" />
          <span>Click {capitalizeFirstLetter(pokemon.name)} to hear cry!</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl capitalize">{pokemon.name}</h3>
        <div className="text-emerald-500/70">
          #{pokemon.id.toString().padStart(3, "0")}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {pokemon.types.map((type) => (
          <div
            key={`${type}-${pokemon.id}`}
            className="px-3 py-1 border border-emerald-500/50 bg-emerald-900/20"
          >
            {type}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          <span>HP: {pokemon.stats.hp}</span>
        </div>
        <div className="flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          <span>Speed: {pokemon.stats.speed}</span>
        </div>
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          <span>Defense: {pokemon.stats.defense}</span>
        </div>
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          <span>Sp. Def: {pokemon.stats.specialDefense}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-500/30">
        <div className="text-sm mb-2">
          Height: {pokemon.height / 10}m | Weight: {pokemon.weight / 10}kg
        </div>
        <p className="text-sm">
          {pokemon.description || "No description available for this Pokémon."}
        </p>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex space-x-2">
          <button
            className="border border-emerald-500 px-3 py-2 hover:bg-emerald-900/30 transition-colors"
            disabled={pokemon.id <= 1}
            onClick={() => {
              if (pokemon.id > 1) {
                soundManager.play("ui-click");
                navigateToPokemon(pokemon.id - 1);
              } else {
                soundManager.play("ui-deny");
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            className="border border-emerald-500 px-3 py-2 hover:bg-emerald-900/30 transition-colors"
            disabled={pokemon.id >= 151}
            onClick={() => {
              if (pokemon.id < 151) {
                soundManager.play("ui-click");
                navigateToPokemon(pokemon.id + 1);
              } else {
                soundManager.play("ui-deny");
              }
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
