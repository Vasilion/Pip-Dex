"use client";

import { useState, useCallback } from "react";
import type { PokemonType } from "@/types/pokemon";

export function usePokemon() {
  const [pokemon, setPokemon] = useState<PokemonType[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);

  const fetchPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the first 151 Pokémon (Gen 1)
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();

      // Fetch detailed data for each Pokémon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const detailResponse = await fetch(pokemon.url);
          return await detailResponse.json();
        })
      );

      // Extract species descriptions
      const speciesData = await Promise.all(
        pokemonDetails.map(async (pokemon: any) => {
          const speciesResponse = await fetch(pokemon.species.url);
          return await speciesResponse.json();
        })
      );

      // Fetch evolution chains for each species
      const evolutionChains = await Promise.all(
        speciesData.map(async (species: any) => {
          const evolutionChainResponse = await fetch(
            species.evolution_chain.url
          );
          return await evolutionChainResponse.json();
        })
      );

      // Process and format the data
      const formattedPokemon: PokemonType[] = pokemonDetails.map(
        (pokemon: any, index: number) => {
          const species = speciesData[index];
          const evolutionChain = evolutionChains[index];

          // Find English description
          const englishFlavorText = species.flavor_text_entries.find(
            (entry: any) => entry.language.name === "en"
          );

          // Extract types
          const types = pokemon.types.map((type: any) => type.type.name);

          // Extract stats
          const stats = {
            hp: pokemon.stats.find((stat: any) => stat.stat.name === "hp")
              .base_stat,
            attack: pokemon.stats.find(
              (stat: any) => stat.stat.name === "attack"
            ).base_stat,
            defense: pokemon.stats.find(
              (stat: any) => stat.stat.name === "defense"
            ).base_stat,
            specialAttack: pokemon.stats.find(
              (stat: any) => stat.stat.name === "special-attack"
            ).base_stat,
            specialDefense: pokemon.stats.find(
              (stat: any) => stat.stat.name === "special-defense"
            ).base_stat,
            speed: pokemon.stats.find((stat: any) => stat.stat.name === "speed")
              .base_stat,
          };

          // Extract abilities
          const abilities = pokemon.abilities.map((ability: any) => ({
            name: ability.ability.name,
            isHidden: ability.is_hidden,
            description: "", // Will be filled later if needed
          }));

          // Extract sprites
          const sprites = {
            front_default: pokemon.sprites.other.showdown.front_default,
            back_default: pokemon.sprites.back_default,
            shiny: pokemon.sprites.front_shiny,
            animated:
              pokemon.sprites.versions?.["generation-v"]?.["black-white"]
                ?.animated?.front_default || null,
          };

          // Process evolution chain
          const processedEvolutionChain = processEvolutionChain(
            evolutionChain.chain
          );

          return {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            types,
            stats,
            abilities,
            sprites,
            description: englishFlavorText
              ? englishFlavorText.flavor_text.replace(/\f/g, " ")
              : "",
            moves: pokemon.moves.slice(0, 20).map((move: any) => ({
              name: move.move.name,
              type: "normal", // Default, would need another API call to get actual type
              power: null, // Would need another API call
            })),
            evolutionChain: processedEvolutionChain,
          };
        }
      );

      // Extract all unique types
      const allTypes = Array.from(
        new Set(formattedPokemon.flatMap((p) => p.types))
      ).sort();

      setPokemonTypes(allTypes);
      setPokemon(formattedPokemon);

      // Set the first Pokémon as selected by default
      if (formattedPokemon.length > 0) {
        setSelectedPokemon(formattedPokemon[0]);
      }
    } catch (err) {
      console.error("Error fetching Pokémon data:", err);
      setError("Failed to fetch Pokémon data");
    } finally {
      setLoading(false);
    }
  }, []);

  const processEvolutionChain = (chain: any) => {
    const evolutionDetails = [];

    let currentEvolution = chain;

    while (currentEvolution) {
      const speciesName = currentEvolution.species.name;
      const speciesUrl = currentEvolution.species.url;

      const idMatch = speciesUrl.match(/\/pokemon-species\/(\d+)\//);
      const id = idMatch ? parseInt(idMatch[1]) : 0;

      let evolutionDetail = "Level 1";

      if (
        currentEvolution.evolution_details &&
        currentEvolution.evolution_details.length > 0
      ) {
        const details = currentEvolution.evolution_details[0];

        if (details.min_level) {
          evolutionDetail = `Level ${details.min_level}`;
        } else if (details.item) {
          evolutionDetail = `Use ${details.item.name}`;
        } else if (details.trigger && details.trigger.name === "trade") {
          evolutionDetail = "Trade";
        } else if (details.min_happiness) {
          evolutionDetail = "High friendship";
        }
      }

      evolutionDetails.push({
        name: speciesName,
        id: id,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        evolutionDetails: evolutionDetail,
      });

      if (
        currentEvolution.evolves_to &&
        currentEvolution.evolves_to.length > 0
      ) {
        currentEvolution = currentEvolution.evolves_to[0];
      } else {
        currentEvolution = null;
      }
    }

    return evolutionDetails;
  };

  const selectPokemon = useCallback((pokemon: PokemonType) => {
    setSelectedPokemon(pokemon);
  }, []);

  return {
    pokemon,
    selectedPokemon,
    loading,
    error,
    fetchPokemon,
    selectPokemon,
    pokemonTypes,
  };
}
