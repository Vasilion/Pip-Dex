"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Info,
  Zap,
  Filter,
} from "lucide-react";
import PokemonList from "@/components/pokemon-list";
import PokemonDetails from "@/components/pokemon-details";
import PokemonStats from "@/components/pokemon-stats";
import SoundToggle from "@/components/sound-toggle";
import { usePokemon } from "@/hooks/use-pokemon";
import Loading from "@/components/loading";
import { soundManager } from "@/utils/sound";

export default function Home() {
  const [activeTab, setActiveTab] = useState("DEX");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    pokemon,
    selectedPokemon,
    loading,
    error,
    fetchPokemon,
    selectPokemon,
    pokemonTypes,
  } = usePokemon();
  const [typesExpanded, setTypesExpanded] = useState(false);
  const detailsRef = useRef(null);
  const pokemonListRef = useRef(null);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  // Scroll to details section when a Pokémon is selected on mobile
  useEffect(() => {
    if (selectedPokemon && detailsRef.current && window.innerWidth < 1024) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPokemon]);

  // Scroll to Pokémon list when a type is selected on mobile
  useEffect(() => {
    if (pokemonListRef.current && window.innerWidth < 1024 && activeCategory) {
      pokemonListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeCategory]);

  const filteredPokemon = pokemon.filter((p) => {
    // Filter by search query
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by type
    if (activeCategory !== "All" && !p.types.includes(activeCategory)) {
      return false;
    }

    return true;
  });

  const handleTabChange = (tab: string) => {
    soundManager.play("ui-tab");
    setActiveTab(tab);

    if (tab === "DEX") {
      setActiveCategory("All");
    } else if (tab === "STATS") {
      setActiveCategory("Base Stats");
    }
  };

  const handleCategoryChange = (category: string) => {
    soundManager.play("ui-click");
    setActiveCategory(category);
    // Close the types menu on mobile after selection
    if (window.innerWidth < 1024) {
      setTypesExpanded(false);
    }
  };

  const handleTypesToggle = () => {
    soundManager.play("ui-click");
    setTypesExpanded(!typesExpanded);
  };

  const renderTabContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-emerald-500 font-mono text-center">
            <div className="text-2xl mb-4">ERROR</div>
            <div className="text-sm">
              Failed to load Pokémon data. Please try again.
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "DEX":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-emerald-500 font-mono h-full">
            {/* Mobile search bar - always visible on mobile */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-500/70" />
                <input
                  type="text"
                  placeholder="Search Pokémon..."
                  className="w-full bg-black/50 border border-emerald-500/50 p-2 pl-8 text-emerald-500 focus:border-emerald-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Left column - Types (collapsible on mobile) */}
            <div className="border-r border-emerald-500/30 pr-4 lg:block">
              <div
                className="flex items-center justify-between cursor-pointer lg:cursor-default mb-4"
                onClick={handleTypesToggle}
              >
                <h2 className="text-xl flex items-center">
                  <ChevronDown className="h-5 w-5 mr-2" />
                  TYPES
                </h2>
                <button className="lg:hidden border border-emerald-500/50 p-1 rounded">
                  {typesExpanded ? "−" : "+"}
                </button>
              </div>

              {/* Desktop search bar */}
              <div className="hidden lg:block mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-500/70" />
                  <input
                    type="text"
                    placeholder="Search Pokémon..."
                    className="w-full bg-black/50 border border-emerald-500/50 p-2 pl-8 text-emerald-500 focus:border-emerald-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Types list - collapsible on mobile */}
              <div className={`${typesExpanded ? "block" : "hidden"} lg:block`}>
                <ul className="space-y-1 max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                  <li
                    key="All"
                    className={`flex items-center cursor-pointer ${
                      activeCategory === "All"
                        ? "bg-emerald-900/30"
                        : "hover:bg-emerald-900/20"
                    } p-2 transition-colors`}
                    onClick={() => handleCategoryChange("All")}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    All
                  </li>
                  {pokemonTypes.map((type) => (
                    <li
                      key={type}
                      className={`flex items-center cursor-pointer ${
                        activeCategory === type
                          ? "bg-emerald-900/30"
                          : "hover:bg-emerald-900/20"
                      } p-2 transition-colors`}
                      onClick={() => handleCategoryChange(type)}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Middle column - Pokémon list */}
            <div
              className="border-r border-emerald-500/30 pr-4"
              ref={pokemonListRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">POKÉMON</h2>
                <div className="text-sm">{filteredPokemon.length} found</div>
              </div>
              <PokemonList
                pokemon={filteredPokemon}
                selectedPokemon={selectedPokemon}
                onSelectPokemon={(pokemon) => {
                  soundManager.play("ui-select");
                  soundManager.playPokemonCry(pokemon.id);
                  selectPokemon(pokemon);
                }}
              />
            </div>

            {/* Right column - Pokémon details */}
            <div ref={detailsRef}>
              <h2 className="text-xl mb-4">DETAILS</h2>
              {selectedPokemon ? (
                <PokemonDetails pokemon={selectedPokemon} />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-emerald-500/70 text-center">
                    <Info className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a Pokémon to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "STATS":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-emerald-500 font-mono h-full">
            {/* Left column - Categories */}
            <div className="border-r border-emerald-500/30 pr-4">
              <h2 className="text-xl mb-4 flex items-center">
                <ChevronDown className="h-5 w-5 mr-2" />
                STATS
              </h2>
              <ul className="space-y-3">
                {["Base Stats", "Evolution", "Moves", "Abilities"].map(
                  (category) => (
                    <li
                      key={category}
                      className={`flex items-center cursor-pointer ${
                        activeCategory === category
                          ? "bg-emerald-900/30"
                          : "hover:bg-emerald-900/20"
                      } p-2 transition-colors`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {category}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Middle and Right columns - Stats display */}
            <div className="col-span-2" ref={detailsRef}>
              {selectedPokemon ? (
                <PokemonStats
                  pokemon={selectedPokemon}
                  category={activeCategory}
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-emerald-500/70 text-center">
                    <Info className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a Pokémon to view stats</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "MAP":
        return (
          <div className="grid grid-cols-1 gap-6 text-emerald-500 font-mono h-full">
            <div className="text-center py-12">
              <h2 className="text-2xl mb-6">REGION MAP</h2>
              <div className="border-2 border-emerald-500/50 p-4 max-w-3xl mx-auto">
                <div className="aspect-video relative bg-emerald-900/20 flex items-center justify-center">
                  <div className="text-emerald-500/70 text-center">
                    <p className="mb-4">MAP DATA LOADING...</p>
                    <p className="text-xs">
                      SIGNAL LOST - PIP-BOY LOCATION SERVICES UNAVAILABLE
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm max-w-lg mx-auto">
                The Pokémon world map functionality is currently unavailable.
                Your Pip-Boy is unable to establish a connection with the
                regional mapping servers.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Top bar with stats */}
      <div className="flex justify-between items-center p-4 border-b border-emerald-500/30 text-emerald-500 font-mono text-sm">
        <div className="flex space-x-6">
          <span className="hidden md:inline">TRAINER LVL: 42</span>
          <span>BADGES: 8/8</span>
        </div>
        <div className="text-xl font-bold tracking-wider">PIP-DEX 3000</div>
        <div className="flex items-center space-x-6">
          <span className="hidden md:inline">CAUGHT: {pokemon.length}/151</span>
          <span className="hidden sm:inline">SEEN: 151/151</span>
          <SoundToggle />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow p-4 overflow-auto">{renderTabContent()}</div>

      {/* Bottom navigation */}
      <div className="p-4 border-t border-emerald-500/30 flex justify-center text-emerald-500 font-mono">
        <div className="flex space-x-8">
          <button
            className={`px-6 py-3 flex items-center justify-center transition-colors ${
              activeTab === "DEX"
                ? "bg-emerald-500 text-black"
                : "hover:bg-emerald-900/30"
            }`}
            onClick={() => handleTabChange("DEX")}
          >
            <Info className="h-5 w-5 mr-2" />
            DEX
          </button>
          <button
            className={`px-6 py-3 flex items-center justify-center transition-colors ${
              activeTab === "STATS"
                ? "bg-emerald-500 text-black"
                : "hover:bg-emerald-900/30"
            }`}
            onClick={() => handleTabChange("STATS")}
          >
            <Zap className="h-5 w-5 mr-2" />
            STATS
          </button>
          <button
            className={`px-6 py-3 flex items-center justify-center transition-colors ${
              activeTab === "MAP"
                ? "bg-emerald-500 text-black"
                : "hover:bg-emerald-900/30"
            }`}
            onClick={() => handleTabChange("MAP")}
          >
            <Filter className="h-5 w-5 mr-2" />
            MAP
          </button>
        </div>
      </div>
    </main>
  );
}
