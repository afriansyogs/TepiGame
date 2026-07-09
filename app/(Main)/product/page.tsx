"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, Frown } from "lucide-react";
import Link from "next/link";
import { getAllGames, Game } from "@/services/gameService";

// Custom Debounce for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function ProductPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [activeFilter, setActiveFilter] = useState("Semua");
  
  const filters = ["Semua", "Populer", "Promo", "Mobile", "PC"];

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await getAllGames();
        setGames(data);
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGames();
  }, []);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === "Populer") matchesFilter = game.isPopular;
    else if (activeFilter === "Promo") matchesFilter = game.isPromo;
    else if (activeFilter === "Mobile") matchesFilter = game.category === "Mobile";
    else if (activeFilter === "PC") matchesFilter = game.category === "PC";

    return matchesSearch && matchesFilter;
  });

  const isSearching = isLoading || (searchQuery !== debouncedQuery);

  return (
    <div className="w-full min-h-screen pb-24">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-4xl xl:max-w-[85%] xl:pt-8">
        <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#0F0F0F] aspect-[4/3] sm:aspect-[21/8] md:aspect-[25/6] mb-8 shadow-2xl flex items-center justify-center flex-col p-6 border border-gray-800">
          <div className="absolute inset-0 z-0 opacity-80 sm:opacity-100">
            <Image
              src="/img/banner-search.svg"
              alt="Search Banner"
              fill
              className="object-cover object-right md:object-center"
              priority
            />
          </div>
          <div className="relative z-10 flex flex-col items-center w-full max-w-2xl text-center mt-6 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 md:mb-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              Cari Game Favoritemu!
            </h1>
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl">
              <input
                type="text"
                placeholder="Cari game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 md:h-14 pl-6 pr-14 rounded-full text-gray-900 bg-white outline-none focus:ring-4 focus:ring-[#9B00E8]/50 shadow-lg font-medium text-sm md:text-base transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-[#9B00E8]" />
                ) : (
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all border-2 whitespace-nowrap ${
                activeFilter === filter
                  ? "border-[#9B00E8] text-[#9B00E8] bg-white shadow-sm"
                  : "border-gray-200 text-gray-800 bg-transparent hover:border-gray-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {
        isSearching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-200 animate-pulse shadow-sm">
                <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-4 gap-2">
                  <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                href={game.link || "#"}
                className="group relative w-full overflow-hidden rounded-2xl bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#9B00E8]/30 ring-1 ring-white/10 hover:ring-[#9B00E8]/50"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={game.imageUrl}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0033] via-[#1A0033]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-4">
                    {game.isPromo && (
                      <span className="mb-2 w-max rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                        PROMO
                      </span>
                    )}
                    <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-tight text-white drop-shadow-md">
                      {game.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-300 drop-shadow-sm">
                      {game.publisher}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          
          <div className="w-full flex flex-col items-center justify-center py-20 text-center">
            <Frown className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Game tidak ditemukan</h3>
            <p className="text-gray-500 max-w-md">
              Kami tidak dapat menemukan game yang cocok dengan pencarian "{debouncedQuery}" pada filter {activeFilter}. Coba gunakan kata kunci lain.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("Semua");
              }}
              className="mt-6 px-6 py-2 bg-[#9B00E8] text-white font-bold rounded-full hover:bg-[#7a00b8] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}