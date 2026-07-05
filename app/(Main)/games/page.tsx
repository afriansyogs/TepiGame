"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function GamesPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-white py-12 lg:py-20 flex items-center">
      <div className="mx-auto max-w-[90%] px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="absolute -inset-4 bg-purple-100/30 rounded-full blur-3xl -z-10" />
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [-12, 12, -12]
              }}
              transition={{
                x: { duration: 0.8, ease: "easeOut" },
                y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
              }}
              style={{ willChange: "transform" }}
              className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[600px] md:h-[600px]"
            >
              <Image
                src="/img/money-mascot.png"
                alt="Astronaut Mascot holding purple coins"
                fill
                priority
                sizes="(max-width: 768px) 320px, (max-width: 1200px) 420px, 600px"
                className="object-contain"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left relative py-8 lg:py-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [-8, 8, -8],
                rotate: [0, 8, 0]
              }}
              transition={{
                scale: { duration: 0.6, delay: 0.3 },
                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              style={{ willChange: "transform" }}
              className="absolute -left-5 lg:-left-32 top-20 lg:top-12 w-16 h-16 sm:w-24 sm:h-24 z-0"
            >
              <Image
                src="/img/coin.png"
                alt="Gold Coin"
                fill
                sizes="(max-width: 768px) 48px, 80px"
                className="object-contain blur-[2px]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [-10, 10, -10],
                rotate: [0, -10, 0]
              }}
              transition={{
                scale: { duration: 0.6, delay: 0.4 },
                y: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 7, ease: "easeInOut" }
              }}
              style={{ willChange: "transform" }}
              className="absolute right-4 lg:left-80 xl:left-104 -top-10 md:-top-20 w-20 h-20 sm:w-36 sm:h-36"
            >
              <Image
                src="/img/console.png"
                alt="Game Controller"
                fill
                sizes="(max-width: 768px) 80px, 144px"
                className="object-contain blur-[2px]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="z-10 max-w-xl"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight select-none">
                Main Game,<br />
                Kumpulkan Poin!
              </h1> 
              <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium mt-6 leading-relaxed max-w-md">
                Tukarkan poinmu dengan hadiah menarik dan voucher diskon eksklusif.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-block"
              >
                <button className="bg-[#9B00E8] hover:bg-[#8500c7] text-white px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 cursor-pointer">
                  Main Sekarang
                </button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [8, -8, 8],
                rotate: [0, 12, 0]
              }}
              transition={{
                scale: { duration: 0.6, delay: 0.5 },
                y: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 6.5, ease: "easeInOut" }
              }}
              style={{ willChange: "transform" }}
              className="absolute right-0 lg:left-72 xl:left-92 -bottom-6 md:-bottom-10 w-20 h-20 sm:w-24 sm:h-24"
            >
              <Image
                src="/img/trophy.png"
                alt="Trophy"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-contain blur-[2px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}