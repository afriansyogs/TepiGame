"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CountdownTimer from "@/components/common/CountdownTimer";

interface FlashSaleItem {
  id: string;
  title: string;
  subtitle: string;
  discount: number;
  image: string;
  salePrice: string;
  originalPrice: string;
  remainingPercentage: number;
}

const FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: "1",
    title: "Mobile Legends",
    subtitle: "774 + 120 Diamonds",
    discount: 25,
    image: "/img/mobile_legends.jpg",
    salePrice: "Rp 195k",
    originalPrice: "Rp 260k",
    remainingPercentage: 12,
  },
  {
    id: "2",
    title: "Valorant",
    subtitle: "2400 VP",
    discount: 15,
    image: "/img/valorant.jpg",
    salePrice: "Rp 255k",
    originalPrice: "Rp 300k",
    remainingPercentage: 45,
  },
  {
    id: "3",
    title: "Genshin Impact",
    subtitle: "Blessing of the Welkin Moon",
    discount: 30,
    image: "/img/genshin_impact.jpg",
    salePrice: "Rp 55k",
    originalPrice: "Rp 79k",
    remainingPercentage: 5,
  },
  {
    id: "4",
    title: "Free Fire",
    subtitle: "1080 + 108 Diamonds",
    discount: 20,
    image: "/img/free_fire.jpg",
    salePrice: "Rp 120k",
    originalPrice: "Rp 150k",
    remainingPercentage: 18,
  },
  {
    id: "5",
    title: "PUBG Mobile",
    subtitle: "1800 + 420 UC",
    discount: 10,
    image: "/img/pubg_mobile.jpg",
    salePrice: "Rp 270k",
    originalPrice: "Rp 300k",
    remainingPercentage: 60,
  },
];

export default function FlashSale() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      window.addEventListener("resize", checkScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollButtons);
      }
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isExpired) return null;

  return (
    <section className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-[90%] lg:px-12 xl:px-10 ">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-4 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <h2 className="flex items-center text-3xl font-black tracking-tight md:text-4xl select-none">
              <span className="text-[#E000C1]">F</span>
              <span className="text-yellow-400 drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)] text-2xl">⚡</span>
              <span className="text-[#E000C1]">ash</span>
              <span className="text-gray-900 ml-2 md:ml-3">Sale</span>
            </h2>
            
            <CountdownTimer initialSeconds={7200} onComplete={() => setIsExpired(true)} />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!showLeftArrow}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!showRightArrow}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 pb-6 pt-2 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {FLASH_SALE_ITEMS.map((item) => {
              const isUrgent = item.remainingPercentage <= 20;
              return (
                <div
                  key={item.id}
                  className="flex flex-row items-center gap-4 bg-white rounded-3xl shadow-lg cursor-pointer border border-gray-200 p-4 min-w-[340px] max-w-[380px] md:min-w-[400px] snap-start transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-100 relative group"
                >
                  <div className="relative w-28 h-36 md:w-32 md:h-40 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 112px, 128px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-[#9B00E8] text-white text-[10px] md:text-xs font-extrabold px-2 py-1 rounded-lg shadow-sm">
                      -{item.discount}%
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between h-full py-1">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base md:text-lg line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="flex items-baseline mt-3">
                      <span className="text-[#9B00E8] font-extrabold text-lg md:text-xl">
                        {item.salePrice}
                      </span>
                      <span className="text-gray-400 text-xs md:text-sm line-through ml-2 font-semibold">
                        {item.originalPrice}
                      </span>
                    </div>
                    <div className="mt-4 w-full">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-gray-400 text-[10px] md:text-xs font-semibold">
                          Remaining Quota
                        </span>
                        <span
                          className={cn(
                            "text-[10px] md:text-xs font-bold",
                            isUrgent ? "text-rose-600" : "text-[#9B00E8]"
                          )}
                        >
                          {item.remainingPercentage}% left
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isUrgent ? "bg-rose-600" : "bg-[#9B00E8]"
                          )}
                          style={{ width: `${item.remainingPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
