"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { getPopularGames, Game } from "@/services/gameService";

export default function PopularGames() {
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const games = await getPopularGames();
        setPopularGames(games);
      } catch (error) {
        console.error("Failed to load popular games:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGames();
  }, []);

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[90%] sm:max-w-[85%] md:max-w-[85%] lg:max-w-[83%] xl:max-w-[86%]">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Popular</h2>
            <p className="mt-1 text-sm text-gray-500">Populer Dikalangan Gamers</p>
          </div>
          <Link
            href="/product"
            className="group flex items-center gap-1.5 text-sm font-semibold text-[#E000C1] hover:text-[#aa0085] transition-colors"
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex-none w-[160px] sm:w-[200px] lg:w-auto snap-start overflow-hidden rounded-2xl bg-gray-200 animate-pulse">
                <div className="relative aspect-[3/4] w-full"></div>
              </div>
            ))
          ) : (
            popularGames.map((game) => (
              <Link
                key={game.id}
                href={game.link || "#"}
                className="group relative flex-none w-[160px] sm:w-[200px] lg:w-auto snap-start overflow-hidden rounded-2xl bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/30 ring-1 ring-white/10 hover:ring-purple-500/50"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={game.imageUrl}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 160px, (max-width: 1024px) 200px, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0033] via-[#1A0033]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-4">
                    <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-tight text-white drop-shadow-md">
                      {game.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-300 drop-shadow-sm">
                      {game.publisher}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
