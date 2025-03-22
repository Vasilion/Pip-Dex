"use client"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import type { PokemonType } from "@/types/pokemon"

interface PokemonListProps {
  pokemon: PokemonType[]
  selectedPokemon: PokemonType | null
  onSelectPokemon: (pokemon: PokemonType) => void
}

export default function PokemonList({ pokemon, selectedPokemon, onSelectPokemon }: PokemonListProps) {
  const [sortOrder, setSortOrder] = useState<"id" | "name">("id")

  const sortedPokemon = [...pokemon].sort((a, b) => {
    if (sortOrder === "id") {
      return a.id - b.id
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "id" ? "name" : "id")
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleSortOrder}
          className="flex items-center text-xs border border-emerald-500/50 px-2 py-1 hover:bg-emerald-900/20"
        >
          Sort by {sortOrder === "id" ? "ID" : "Name"}
          <ArrowUpDown className="h-3 w-3 ml-1" />
        </button>
      </div>
      <ul className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {sortedPokemon.map((p) => (
          <li
            key={p.id}
            className={`flex items-center cursor-pointer ${selectedPokemon?.id === p.id ? "bg-emerald-900/30" : "hover:bg-emerald-900/20"} p-2 transition-colors`}
            onClick={() => onSelectPokemon(p)}
          >
            <div className="w-10 text-right mr-3 text-emerald-500/70">#{p.id.toString().padStart(3, "0")}</div>
            <div className="flex-1 capitalize">{p.name}</div>
            <div className="hidden sm:flex space-x-1">
              {p.types.map((type) => (
                <div key={type} className="text-xs px-2 py-0.5 border border-emerald-500/50 bg-emerald-900/20">
                  {type}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

