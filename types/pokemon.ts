export interface PokemonType {
  id: number
  name: string
  height: number
  weight: number
  types: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  abilities: {
    name: string
    isHidden: boolean
    description?: string
  }[]
  sprites: {
    front_default: string
    back_default?: string
    shiny?: string
    animated?: string
  }
  description?: string
  moves?: {
    name: string
    type?: string
    power?: number | null
  }[]
  evolutionChain?: {
    id: number
    name: string
    sprite: string
    evolutionDetails?: string
  }[]
}

