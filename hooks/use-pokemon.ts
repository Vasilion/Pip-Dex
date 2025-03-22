"use client"

import { useState, useCallback } from "react"
import type { PokemonType } from "@/types/pokemon"

export function usePokemon() {
  const [pokemon, setPokemon] = useState<PokemonType[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([])

  const fetchPokemon = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch the first 151 Pokémon (Gen 1)
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      const data = await response.json()

      // Fetch detailed data for each Pokémon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const detailResponse = await fetch(pokemon.url)
          return await detailResponse.json()
        }),
      )

      // Extract species descriptions
      const speciesData = await Promise.all(
        pokemonDetails.map(async (pokemon: any) => {
          const speciesResponse = await fetch(pokemon.species.url)
          return await speciesResponse.json()
        }),
      )

      // Process and format the data
      const formattedPokemon: PokemonType[] = pokemonDetails.map((pokemon: any, index: number) => {
        const species = speciesData[index]

        // Find English description
        const englishFlavorText = species.flavor_text_entries.find((entry: any) => entry.language.name === "en")

        // Extract types
        const types = pokemon.types.map((type: any) => type.type.name)

        // Extract stats
        const stats = {
          hp: pokemon.stats.find((stat: any) => stat.stat.name === "hp").base_stat,
          attack: pokemon.stats.find((stat: any) => stat.stat.name === "attack").base_stat,
          defense: pokemon.stats.find((stat: any) => stat.stat.name === "defense").base_stat,
          specialAttack: pokemon.stats.find((stat: any) => stat.stat.name === "special-attack").base_stat,
          specialDefense: pokemon.stats.find((stat: any) => stat.stat.name === "special-defense").base_stat,
          speed: pokemon.stats.find((stat: any) => stat.stat.name === "speed").base_stat,
        }

        // Extract abilities
        const abilities = pokemon.abilities.map((ability: any) => ({
          name: ability.ability.name,
          isHidden: ability.is_hidden,
          description: "", // Will be filled later if needed
        }))

        // Extract sprites
        const sprites = {
          front_default: pokemon.sprites.front_default,
          back_default: pokemon.sprites.back_default,
          shiny: pokemon.sprites.front_shiny,
          animated: pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default || null,
        }

        return {
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          types,
          stats,
          abilities,
          sprites,
          description: englishFlavorText ? englishFlavorText.flavor_text.replace(/\f/g, " ") : "",
          moves: pokemon.moves.slice(0, 20).map((move: any) => ({
            name: move.move.name,
            type: "normal", // Default, would need another API call to get actual type
            power: null, // Would need another API call
          })),
          evolutionChain: [], // Would need another API call
        }
      })

      // Extract all unique types
      const allTypes = Array.from(new Set(formattedPokemon.flatMap((p) => p.types))).sort()

      setPokemonTypes(allTypes)
      setPokemon(formattedPokemon)

      // Set the first Pokémon as selected by default
      if (formattedPokemon.length > 0) {
        setSelectedPokemon(formattedPokemon[0])
      }
    } catch (err) {
      console.error("Error fetching Pokémon data:", err)
      setError("Failed to fetch Pokémon data")
    } finally {
      setLoading(false)
    }
  }, [])

  const selectPokemon = useCallback((pokemon: PokemonType) => {
    setSelectedPokemon(pokemon)
  }, [])

  return {
    pokemon,
    selectedPokemon,
    loading,
    error,
    fetchPokemon,
    selectPokemon,
    pokemonTypes,
  }
}

