"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { PokemonType } from "@/types/pokemon";
import { Heart, Shield, Swords, Zap } from "lucide-react";
import { soundManager } from "@/utils/sound";

interface PokemonStatsProps {
  pokemon: PokemonType;
  category: string;
}

export default function PokemonStats({ pokemon, category }: PokemonStatsProps) {
  useEffect(() => {
    soundManager.loadPokemonCry(pokemon.name);
  }, [pokemon.name]);

  const handlePokemonImageClick = () => {
    soundManager.playPokemonCry(pokemon.name);
  };

  const renderContent = () => {
    switch (category) {
      case "Base Stats":
        return (
          <div className="space-y-6">
            <h2 className="text-xl mb-4 capitalize">
              {pokemon.name}'s Base Stats
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>HP</span>
                  </div>
                  <span>{pokemon.stats.hp}</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-4 border border-emerald-500/30">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (pokemon.stats.hp / 255) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Swords className="h-4 w-4 mr-2" />
                    <span>Attack</span>
                  </div>
                  <span>{pokemon.stats.attack}</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-4 border border-emerald-500/30">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (pokemon.stats.attack / 255) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Defense</span>
                  </div>
                  <span>{pokemon.stats.defense}</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-4 border border-emerald-500/30">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (pokemon.stats.defense / 255) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Swords className="h-4 w-4 mr-2" />
                    <span>Sp. Attack</span>
                  </div>
                  <span>{pokemon.stats.specialAttack}</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-4 border border-emerald-500/30">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (pokemon.stats.specialAttack / 255) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Sp. Defense</span>
                  </div>
                  <span>{pokemon.stats.specialDefense}</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-4 border border-emerald-500/30">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (pokemon.stats.specialDefense / 255) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    <span>Speed</span>
                  </div>
                  <span>{pokemon.stats.speed}</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-4 border border-emerald-500/30">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (pokemon.stats.speed / 255) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-500/30">
              <div className="text-sm">
                <div className="mb-2">
                  Total:{" "}
                  {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
                </div>
                <p>
                  Base stats determine a Pokémon's starting capabilities. These
                  values can increase through leveling up and evolution.
                </p>
              </div>
            </div>
          </div>
        );
      case "Evolution":
        return (
          <div className="space-y-6">
            <h2 className="text-xl mb-4">Evolution Chain</h2>

            {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                {pokemon.evolutionChain.map((stage, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 relative bg-emerald-900/20 border-2 border-emerald-500/30 flex items-center justify-center mb-2 cursor-pointer"
                      onClick={() => handlePokemonImageClick()}
                    >
                      {stage.sprite && (
                        <Image
                          src={stage.sprite || "/placeholder.svg"}
                          alt={stage.name}
                          width={100}
                          height={100}
                          className="pixelated"
                          style={{
                            imageRendering: "pixelated",
                            filter:
                              "brightness(1.2) hue-rotate(120deg) saturate(0.3)",
                          }}
                        />
                      )}
                    </div>
                    <div className="capitalize text-center">{stage.name}</div>
                    <div className="text-xs text-emerald-500/70 mb-4">
                      #{stage.id.toString().padStart(3, "0")}
                    </div>

                    <div className="text-xs text-emerald-500/70 my-1">
                      {stage.evolutionDetails}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No evolution data available for this Pokémon.</p>
              </div>
            )}
          </div>
        );
      case "Moves":
        return (
          <div className="space-y-6">
            <h2 className="text-xl mb-4 capitalize">{pokemon.name}'s Moves</h2>

            {pokemon.moves && pokemon.moves.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pokemon.moves.slice(0, 10).map((move, index) => (
                  <div
                    key={index}
                    className="border border-emerald-500/30 p-3 bg-emerald-900/10 cursor-pointer hover:bg-emerald-900/20"
                    onClick={() => soundManager.play("ui-click")}
                  >
                    <div className="font-bold mb-1">{move.name}</div>
                    <div className="flex justify-between text-xs">
                      <span>Type: {move.type}</span>
                      <span>Power: {move.power || "N/A"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No move data available for this Pokémon.</p>
              </div>
            )}

            <div className="text-center text-sm text-emerald-500/70">
              Showing 10 of {pokemon.moves?.length || 0} moves
            </div>
          </div>
        );
      case "Abilities":
        return (
          <div className="space-y-6">
            <h2 className="text-xl mb-4 capitalize">
              {pokemon.name}'s Abilities
            </h2>

            {pokemon.abilities && pokemon.abilities.length > 0 ? (
              <div className="space-y-4">
                {pokemon.abilities.map((ability, index) => (
                  <div
                    key={index}
                    className="border border-emerald-500/30 p-4 bg-emerald-900/10 cursor-pointer hover:bg-emerald-900/20"
                    onClick={() => soundManager.play("ui-click")}
                  >
                    <div className="font-bold mb-2">{ability.name}</div>
                    <p className="text-sm">
                      {ability.description || "No description available."}
                    </p>
                    {ability.isHidden && (
                      <div className="mt-2 text-xs text-emerald-500/70">
                        Hidden Ability
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No ability data available for this Pokémon.</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="h-full overflow-y-auto pr-2">{renderContent()}</div>;
}
