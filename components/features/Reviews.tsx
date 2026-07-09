"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Alex 'Viper' Chen",
    image: "https://i.pravatar.cc/150?u=1",
    rating: 5,
    game: "Valorant",
    comment: "Fastest VP top-up I've ever experienced. Got my battlepass instantly right before the act ended! TepiGame is strictly goated.",
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-indigo-500/30",
    badgeBg: "bg-red-50 border-red-100",
    badgeText: "text-red-600",
  },
  {
    id: 2,
    name: "Sarah 'Healer' J.",
    image: "https://i.pravatar.cc/150?u=2",
    rating: 5,
    game: "Genshin Impact",
    comment: "Used this to get Welkin Moon. So much cheaper than the in-game store and it was delivered in literal seconds. Will buy again!",
    color: "from-emerald-400 to-teal-500",
    shadow: "shadow-teal-500/30",
    badgeBg: "bg-teal-50 border-teal-100",
    badgeText: "text-teal-600",
  },
  {
    id: 3,
    name: "Dimas Pratama",
    image: "https://i.pravatar.cc/150?u=3",
    rating: 4,
    game: "Mobile Legends",
    comment: "Mantap bg, diamond masuk cepet banget gapake lama. CS-nya juga ramah banget pas ditanya-tanya soal nominal.",
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-orange-500/30",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-600",
  },
  {
    id: 4,
    name: "Jason 'Sniper' Wu",
    image: "https://i.pravatar.cc/150?u=4",
    rating: 5,
    game: "PUBG Mobile",
    comment: "Always buying UC here. Never had a single issue and the prices are unbeatable compared to other sites out there.",
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/30",
    badgeBg: "bg-yellow-50 border-yellow-200",
    badgeText: "text-yellow-700",
  },
];

export default function Reviews() {
  return (
    <section className="w-full py-16 overflow-hidden">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-4xl xl:max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Trusted by Gamers
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Lihat pengalaman customer TepiGame.
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-12 pt-8 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:gap-12 lg:overflow-visible lg:pb-8 lg:px-0 lg:mx-0">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -10, rotate: -1, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative flex-none w-[320px] sm:w-[400px] lg:w-auto snap-start flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 pt-10 sm:pt-12 border border-gray-100 ${review.shadow} shadow-[0_20px_40px_-15px_var(--tw-shadow-color)] z-10`}
            >
              <div
                className={`absolute -top-6 -left-4 sm:-top-8 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${review.color} p-[3px] shadow-lg z-20 ring-4 ring-white`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" strokeWidth={1.5} />
                </div>
              </div>

              <div className="absolute top-4 right-6 text-6xl text-gray-100 font-serif font-black select-none pointer-events-none z-0">
                &quot;
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-2 relative z-10 pl-14 sm:pl-16">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {review.name}
                  </h3>
                  <div className={`inline-block mt-1.5 px-2.5 py-1 rounded-lg border ${review.badgeBg}`}>
                    <span className={`text-xs font-bold ${review.badgeText}`}>
                      {review.game}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-100 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 font-medium leading-relaxed mt-2 relative z-10 sm:text-lg">
                &quot;{review.comment}&quot;
              </p>

              <div className="absolute -bottom-3 right-10 w-8 h-8 bg-white border-b border-r border-gray-100 rounded-sm rotate-45 -z-10 shadow-[8px_8px_16px_-8px_var(--tw-shadow-color)]" style={{ '--tw-shadow-color': 'rgba(0,0,0,0.05)' } as React.CSSProperties} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
