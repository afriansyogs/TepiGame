"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  "/img/banner1.svg",
  "/img/banner2.svg",
  "/img/banner3.svg",
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full pt-8 pb-4">
      <div className="relative mx-auto w-[90%] max-w-6xl">
        <div className="relative w-full aspect-[16/8] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[3/1] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl">
          <h1 className="sr-only">TepiGame - Fastest and Most Trusted Game Top-Up Platform</h1>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={banners[currentIndex]}
                alt={`Promotional Banner ${currentIndex + 1}`}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute -bottom-10 -right-6 z-20 h-28 w-28 sm:-bottom-12 sm:-right-8 sm:h-40 sm:w-40 md:-bottom-16 md:-right-12 md:h-56 md:w-56 lg:-bottom-20 lg:-right-16 lg:h-72 lg:w-72 pointer-events-none select-none">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative h-full w-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]"
          >
            <Image
              src="/img/mascot-rocket.svg"
              alt="Mascot Rocket"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full bg-[#9B00E8]/50 transition-all duration-300 ease-out ${
              currentIndex === index ? "w-10 bg-[#570083]" : "w-2.5 hover:bg-[#8842ac]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
