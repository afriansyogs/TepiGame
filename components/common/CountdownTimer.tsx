"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
}

export default function CountdownTimer({ initialSeconds, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  if (timeLeft <= 0) return null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      h: h.toString().padStart(2, "0"),
      m: m.toString().padStart(2, "0"),
      s: s.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(timeLeft);

  return (
    <div className="flex items-center gap-1.5 pt-1">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white font-bold text-sm shadow-md">
        {time.h}
      </div>
      <span className="text-gray-400 font-bold">:</span>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white font-bold text-sm shadow-md">
        {time.m}
      </div>
      <span className="text-gray-400 font-bold">:</span>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-600 text-white font-bold text-sm shadow-md">
        {time.s}
      </div>
    </div>
  );
}
