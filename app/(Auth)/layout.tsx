"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLogin = pathname === "/login";
  const bgImage = isLogin ? "/img/login-image.png" : "/img/signup-image.png";
  
  const title = isLogin
    ? "Welcome Back"
    : "Create Account";
    
  const description = isLogin
    ? "Top up your favorite games instantly and securely."
    : "Join the TepiGame community and start enjoying exclusive benefits.";

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-900">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#e7e6ff] via-[#a8b3dd] to-[#3B82F6] p-12 lg:flex overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)] pointer-events-none" />
        <Link
          href="/"
          className="absolute left-8 top-8 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur-md transition-all hover:bg-white/60 hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="mt-16 z-10">
          <AnimatePresence mode="wait">
            {mounted && (
              <motion.div
                key={title}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h1 className="text-[2.75rem] font-extrabold leading-tight text-black mb-4 tracking-tight drop-shadow-sm">
                  {title}
                </h1>
                <p className="max-w-md text-black/60 text-lg leading-relaxed drop-shadow-sm">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex-1 flex items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            {mounted && (
              <motion.div
                key={bgImage}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full max-h-[480px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              >
                <Image
                  src={bgImage}
                  alt="Auth Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-8 py-12 sm:px-12 lg:w-1/2 lg:px-24 bg-white">
        <div className="absolute left-6 top-6 lg:hidden">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 border border-gray-200 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}