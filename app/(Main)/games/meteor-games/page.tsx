"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import TopHud from "@/components/features/meteor-games/TopHud";
import PauseMenu from "@/components/features/meteor-games/PauseMenu";
import CountdownOverlay from "@/components/features/meteor-games/CountdownOverlay";
import GameOverModal from "@/components/features/meteor-games/GameOverModal";

export type GameState = "COUNTDOWN" | "PLAYING" | "PAUSED" | "GAMEOVER";

interface MeteorEntity {
  id: number;
  el: HTMLDivElement;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  active: boolean;
}

const GAME_DURATION_S = 30;
const PLAYER_W = 170;
const PLAYER_H = 240;
const COLLISION_SHRINK = 0.55;
const POINTS_PER_DODGE = 10;
const SPAWN_INTERVAL_MS_START = 1200;
const SPAWN_INTERVAL_MS_MIN = 550;
const METEOR_POOL_SIZE = 18;
const MOVE_SPEED_PX = 14;
const HIGH_SCORE_KEY = "meteor_games_highscore";

function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10);
}

function saveHighScore(score: number): void {
  if (typeof window === "undefined") return;
  const prev = getHighScore();
  if (score > prev) localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

export default function MeteorGamesPage() {
  const [gameState, setGameState] = useState<GameState>("COUNTDOWN");
  const [countdown, setCountdown] = useState(3);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState(GAME_DURATION_S);
  const [highScore, setHighScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const arenaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scoreRef = useRef(0);
  const timeRef = useRef(GAME_DURATION_S);
  const gameStateRef = useRef<GameState>("COUNTDOWN");
  const playerXRef = useRef(0);
  const playerYRef = useRef(0);
  const targetXRef = useRef(0);
  const bgYRef = useRef(0);
  const meteorsRef = useRef<MeteorEntity[]>([]);
  const meteorPoolRef = useRef<HTMLDivElement[]>([]);
  const nextMeteorIdRef = useRef(0);
  const arenaSizeRef = useRef({ w: 0, h: 0 });
  const touchStartXRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});

  const initMeteorPool = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    meteorPoolRef.current.forEach((el) => el.remove());
    meteorPoolRef.current = [];

    for (let i = 0; i < METEOR_POOL_SIZE; i++) {
      const el = document.createElement("div");
      el.style.cssText =
        "position:absolute;will-change:transform;visibility:hidden;pointer-events:none;user-select:none;z-index:15;";
      const img = document.createElement("img");
      img.src = "/img/meteor.svg";
      img.style.cssText = "width:100%;height:100%;object-fit:contain;";
      img.draggable = false;
      el.appendChild(img);
      arena.appendChild(el);
      meteorPoolRef.current.push(el);
    }

    const starCount = 10;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 3 + 1;
      star.className = "star-particle";
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * (5 + Math.random() * 5)}px;
        background: rgba(255, 255, 255, ${0.3 + Math.random() * 0.7});
        border-radius: 9999px;
        will-change: transform;
        pointer-events: none;
        z-index: 5;
      `;
      arena.appendChild(star);
    }
  }, []);

  const refreshArenaSize = useCallback(() => {
    if (!arenaRef.current) return;
    const r = arenaRef.current.getBoundingClientRect();
    arenaSizeRef.current = { w: r.width, h: r.height };
  }, []);

  const centerPlayer = useCallback(() => {
    const { w, h } = arenaSizeRef.current;
    const startX = w / 2 - PLAYER_W / 2;
    const startY = h - PLAYER_H - 80;
    playerXRef.current = startX;
    playerYRef.current = startY;
    targetXRef.current = startX;
    if (playerRef.current) {
      playerRef.current.style.transform = `translate3d(${startX}px,${startY}px,0)`;
    }
  }, []);

  const endGame = useCallback(() => {
    if (gameStateRef.current === "GAMEOVER") return;
    gameStateRef.current = "GAMEOVER";

    cancelAnimationFrame(rafRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    meteorsRef.current.forEach((m) => {
      m.active = false;
      m.el.style.visibility = "hidden";
    });
    meteorsRef.current = [];

    const finalS = scoreRef.current;
    saveHighScore(finalS);
    setHighScore(getHighScore());
    setFinalScore(finalS);
    setGameState("GAMEOVER");
  }, []);

  const spawnMeteor = useCallback(() => {
    if (gameStateRef.current !== "PLAYING") return;

    const { w } = arenaSizeRef.current;
    const size = 40 + Math.random() * 50;
    const x = Math.random() * (w - size);
    const speed = 2.5 + Math.random() * 3.5 + (GAME_DURATION_S - timeRef.current) * 0.05;

    const slot = meteorPoolRef.current.find(
      (el) => !meteorsRef.current.some((m) => m.el === el && m.active)
    );
    if (!slot) return;

    const meteor: MeteorEntity = {
      id: nextMeteorIdRef.current++,
      el: slot,
      x,
      y: -size,
      speed,
      size,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      active: true,
    };

    slot.style.width = `${size}px`;
    slot.style.height = `${size}px`;
    slot.style.visibility = "visible";
    slot.style.transform = `translate3d(${x}px,${-size}px,0) rotate(${meteor.rotation}deg)`;

    meteorsRef.current.push(meteor);

    const elapsed = GAME_DURATION_S - timeRef.current;
    const interval = Math.max(
      SPAWN_INTERVAL_MS_MIN,
      SPAWN_INTERVAL_MS_START - elapsed * 8
    );
    spawnTimerRef.current = setTimeout(spawnMeteor, interval);
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== "PLAYING") return;

    const { w, h } = arenaSizeRef.current;

    bgYRef.current = (bgYRef.current + 0.4) % h;
    if (bgRef.current) {
      bgRef.current.style.backgroundPositionY = `${bgYRef.current}px`;
    }

    if (arenaRef.current) {
      const stars = arenaRef.current.getElementsByClassName("star-particle");
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i] as HTMLDivElement;
        let y = parseFloat(star.getAttribute("data-y") || Math.random() * h + "");
        let x = parseFloat(star.getAttribute("data-x") || Math.random() * w + "");
        y += 10 + Math.random() * 15;
        if (y > h) {
          y = -50;
          x = Math.random() * w;
        }
        star.setAttribute("data-y", y.toString());
        star.setAttribute("data-x", x.toString());
        star.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    const dx = targetXRef.current - playerXRef.current;
    playerXRef.current += dx * 0.18;
    playerXRef.current = Math.max(0, Math.min(w - PLAYER_W, playerXRef.current));

    if (playerRef.current) {
      playerRef.current.style.transform = `translate3d(${playerXRef.current}px,${playerYRef.current}px,0)`;
    }

    const pH = PLAYER_H * COLLISION_SHRINK;
    const pW = PLAYER_W * COLLISION_SHRINK;
    const pOffX = (PLAYER_W - pW) / 2;
    const pOffY = (PLAYER_H - pH) / 2;
    const px1 = playerXRef.current + pOffX;
    const px2 = px1 + pW;
    const py1 = playerYRef.current + pOffY;
    const py2 = py1 + pH;

    const toRemove: number[] = [];
    for (let i = 0; i < meteorsRef.current.length; i++) {
      const m = meteorsRef.current[i];
      if (!m.active) continue;

      m.y += m.speed;
      m.rotation += m.rotationSpeed;
      m.el.style.transform = `translate3d(${m.x}px,${m.y}px,0) rotate(${m.rotation}deg)`;

      if (m.y > h + m.size) {
        m.active = false;
        m.el.style.visibility = "hidden";
        toRemove.push(i);
        scoreRef.current += POINTS_PER_DODGE;
        setScoreDisplay(scoreRef.current);
        continue;
      }

      const mx1 = m.x;
      const mx2 = m.x + m.size;
      const my1 = m.y;
      const my2 = m.y + m.size;

      const overlap = px1 < mx2 && px2 > mx1 && py1 < my2 && py2 > my1;
      if (overlap) {
        endGame();
        return;
      }
    }

    if (toRemove.length > 0) {
      meteorsRef.current = meteorsRef.current.filter((_, i) => !toRemove.includes(i));
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [endGame]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let kRaf: number;
    const kLoop = () => {
      if (gameStateRef.current === "PLAYING") {
        const { w } = arenaSizeRef.current;
        if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) {
          targetXRef.current = Math.max(0, targetXRef.current - MOVE_SPEED_PX);
        }
        if (keysRef.current["ArrowRight"] || keysRef.current["d"]) {
          targetXRef.current = Math.min(w - PLAYER_W, targetXRef.current + MOVE_SPEED_PX);
        }
      }
      kRaf = requestAnimationFrame(kLoop);
    };
    kRaf = requestAnimationFrame(kLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(kRaf);
    };
  }, []);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (gameStateRef.current !== "PLAYING") return;
      const dx = e.touches[0].clientX - touchStartXRef.current;
      touchStartXRef.current = e.touches[0].clientX;
      const { w } = arenaSizeRef.current;
      targetXRef.current = Math.max(0, Math.min(w - PLAYER_W, targetXRef.current + dx * 1.4));
    };

    let mouseDown = false;
    let lastMouseX = 0;
    const onMouseDown = (e: MouseEvent) => { mouseDown = true; lastMouseX = e.clientX; };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown || gameStateRef.current !== "PLAYING") return;
      const dx = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      const { w } = arenaSizeRef.current;
      targetXRef.current = Math.max(0, Math.min(w - PLAYER_W, targetXRef.current + dx * 1.4));
    };
    const onMouseUp = () => { mouseDown = false; };

    arena.addEventListener("touchstart", onTouchStart, { passive: true });
    arena.addEventListener("touchmove", onTouchMove, { passive: true });
    arena.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      arena.removeEventListener("touchstart", onTouchStart);
      arena.removeEventListener("touchmove", onTouchMove);
      arena.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    timeRef.current = GAME_DURATION_S;
    bgYRef.current = 0;
    meteorsRef.current = [];
    setScoreDisplay(0);
    setTimeDisplay(GAME_DURATION_S);
    setHighScore(getHighScore());

    gameStateRef.current = "PLAYING";
    setGameState("PLAYING");

    centerPlayer();
    initMeteorPool();

    gameTimerRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeDisplay(timeRef.current);
      if (timeRef.current <= 0) {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        endGame();
      }
    }, 1000);

    spawnTimerRef.current = setTimeout(spawnMeteor, 800);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [centerPlayer, initMeteorPool, spawnMeteor, gameLoop, endGame]);

  useEffect(() => {
    refreshArenaSize();

    let c = 3;
    setCountdown(c);

    countdownTimerRef.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        startGame();
      } else {
        setCountdown(c);
      }
    }, 1000);

    const handleResize = () => {
      refreshArenaSize();
      centerPlayer();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [refreshArenaSize, startGame, centerPlayer]);

  const pauseGame = () => {
    if (gameStateRef.current !== "PLAYING") return;
    gameStateRef.current = "PAUSED";
    setGameState("PAUSED");
    cancelAnimationFrame(rafRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  };

  const resumeGame = () => {
    if (gameStateRef.current !== "PAUSED") return;
    gameStateRef.current = "PLAYING";
    setGameState("PLAYING");

    gameTimerRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeDisplay(timeRef.current);
      if (timeRef.current <= 0) {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        endGame();
      }
    }, 1000);

    spawnTimerRef.current = setTimeout(spawnMeteor, SPAWN_INTERVAL_MS_MIN);
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="relative w-full h-[calc(100dvh-80px)] overflow-hidden select-none bg-gradient-to-b from-[#060120] to-[#260099]">
      <div
        ref={arenaRef}
        className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="absolute inset-0 -z-10 bg-[#1a003d]/60" />

        <TopHud
          gameState={gameState}
          timeDisplay={timeDisplay}
          scoreDisplay={scoreDisplay}
          highScore={highScore}
          gameDuration={GAME_DURATION_S}
          pauseGame={pauseGame}
          resumeGame={resumeGame}
          formatTime={formatTime}
        />

        <div
          ref={playerRef}
          className="absolute z-10"
          style={{
            width: PLAYER_W,
            height: PLAYER_H,
            willChange: "transform",
            pointerEvents: "none",
          }}
        >
          <Image
            src="/img/mascot-rocket.svg"
            alt="Mascot Rocket"
            fill
            className="object-contain"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-40 pointer-events-none">
          <Image
            src="/img/space-button.svg"
            alt="Space Ground"
            fill
            className="object-cover object-top"
            draggable={false}
          />
        </div>

        <AnimatePresence>
          {gameState === "PLAYING" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-sm px-4 py-2 pointer-events-none"
            >
              <span className="text-white/70 text-xs font-semibold">
                ↔ Swipe or use arrow keys to dodge
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameState === "PAUSED" && <PauseMenu resumeGame={resumeGame} />}
        </AnimatePresence>

        <AnimatePresence>
          {gameState === "COUNTDOWN" && (
            <CountdownOverlay countdown={countdown} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameState === "GAMEOVER" && (
            <GameOverModal finalScore={finalScore} highScore={highScore} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
