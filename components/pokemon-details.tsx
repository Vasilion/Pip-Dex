"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Shield, Zap, ArrowLeft, ArrowRight } from "lucide-react"
import type { PokemonType } from "@/types/pokemon"
import { soundManager } from "@/utils/sound"

interface PokemonDetailsProps {
  pokemon: PokemonType
}

export default function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  const [showShiny, setShowShiny] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Toggle between normal and shiny sprites with animation
  const toggleShiny = () => {
    soundManager.play("ui-click")
    setIsAnimating(true)
    setTimeout(() => {
      setShowShiny(!showShiny)
      setIsAnimating(false)
    }, 500)
  }

  const imageUrl = showShiny ? pokemon.sprites.shiny || pokemon.sprites.front_default : pokemon.sprites.front_default

  const animationUrl = pokemon.sprites.animated || pokemon.sprites.front_default

  const handleImageClick = () => {
    soundManager.playPokemonCry(pokemon.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-2">
        <div
          className={`w-32 h-32 sm:w-48 sm:h-48 relative bg-emerald-900/20 border-2 border-emerald-500/30 flex items-center justify-center ${isAnimating ? "animate-pulse" : ""} cursor-pointer`}
          onClick={handleImageClick}
        >
          {imageUrl && (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={pokemon.name}
              width={140}
              height={140}
              className="pixelated"
              style={{
                imageRendering: "pixelated",
                filter: "brightness(1.2) hue-rotate(120deg) saturate(0.3)",
              }}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl capitalize">{pokemon.name}</h3>
        <div className="text-emerald-500/70">#{pokemon.id.toString().padStart(3, "0")}</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {pokemon.types.map((type) => (
          <div key={type} className="px-3 py-1 border border-emerald-500/50 bg-emerald-900/20">
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
        <p className="text-sm">{pokemon.description || "No description available for this Pokémon."}</p>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="border border-emerald-500 px-4 py-2 hover:bg-emerald-900/30 transition-colors flex items-center"
          onClick={toggleShiny}
        >
          {showShiny ? "Normal" : "Shiny"}
        </button>
        <div className="flex space-x-2">
          <button
            className="border border-emerald-500 px-3 py-2 hover:bg-emerald-900/30 transition-colors"
            disabled={pokemon.id <= 1}
            onClick={() => {
              if (pokemon.id > 1) {
                soundManager.play("ui-click")
              } else {
                soundManager.play("ui-deny")
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
                soundManager.play("ui-click")
              } else {
                soundManager.play("ui-deny")
              }
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

