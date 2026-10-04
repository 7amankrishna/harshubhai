'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Music, Flame, PartyPopper, ArrowRight, Stars, Cake } from 'lucide-react';
import { soundEngine } from '@/utils/soundEngine';
import { triggerBirthdayConfetti, triggerHeartBurst, triggerStarBurst } from '@/utils/confetti';

interface BirthdayRevealStageProps {
  recipientName: string;
  birthdayHeadline: string;
  birthdayQuote: string;
  onProceedToMemories: () => void;
}

export const BirthdayRevealStage: React.FC<BirthdayRevealStageProps> = ({
  recipientName,
  birthdayHeadline,
  birthdayQuote,
  onProceedToMemories,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(true);
  const [balloons, setBalloons] = useState([
    { id: 1, x: '10%', color: 'from-pink-500 to-rose-400', popped: false, delay: 0 },
    { id: 2, x: '25%', color: 'from-purple-500 to-indigo-400', popped: false, delay: 0.4 },
    { id: 3, x: '75%', color: 'from-amber-400 to-pink-500', popped: false, delay: 0.2 },
    { id: 4, x: '90%', color: 'from-fuchsia-500 to-pink-400', popped: false, delay: 0.6 },
  ]);

  useEffect(() => {
    // Trigger confetti cannons
    triggerBirthdayConfetti();

    // Play Happy Birthday melody automatically
    soundEngine.playHappyBirthdaySong();

    const timer = setTimeout(() => {
      triggerStarBurst(0.5, 0.3);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setWishMade(true);
    soundEngine.playCandleBlow();
    triggerHeartBurst(0.5, 0.5);
    setTimeout(() => {
      triggerStarBurst(0.5, 0.4);
    }, 400);
  };

  const handlePopBalloon = (id: number) => {
    soundEngine.playClick();
    triggerStarBurst(0.5, 0.3);
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
  };

  const handleReplaySong = () => {
    soundEngine.playHappyBirthdaySong();
    setIsPlayingSong(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-3xl mx-auto relative pb-8"
    >
      {/* Floating Animated Balloons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -top-12 z-0">
        {balloons.map(
          (b) =>
            !b.popped && (
              <motion.div
                key={b.id}
                initial={{ y: 200, opacity: 0 }}
                animate={{
                  y: [-10, -40, -10],
                  x: [0, 10, -10, 0],
                  opacity: 0.85,
                }}
                transition={{
                  y: { repeat: Infinity, duration: 4 + b.delay, ease: 'easeInOut' },
                  x: { repeat: Infinity, duration: 5 + b.delay, ease: 'easeInOut' },
                  opacity: { duration: 1 },
                }}
                style={{ left: b.x }}
                className="absolute pointer-events-auto cursor-pointer"
                onClick={() => handlePopBalloon(b.id)}
                title="Click to pop!"
              >
                <div
                  className={`w-12 h-16 sm:w-16 sm:h-20 rounded-full bg-gradient-to-t ${b.color} shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-transform relative`}
                >
                  {/* Balloon reflection */}
                  <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[1px]" />
                  {/* Balloon string */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/20 origin-top" />
                </div>
              </motion.div>
            )
        )}
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-white/20 text-center z-10">
        {/* Top Celebration Tag */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 text-pink-300 text-xs sm:text-sm font-semibold mb-4 shadow-glow-pink"
        >
          <PartyPopper className="w-4 h-4 text-pink-400 animate-bounce" />
          <span>The Grand Birthday Reveal</span>
          <Stars className="w-4 h-4 text-amber-300 animate-spin-slow" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif-custom font-extrabold text-white tracking-tight leading-tight mb-4"
        >
          <span className="block text-glow-pink bg-gradient-to-r from-pink-300 via-purple-200 to-pink-400 bg-clip-text text-transparent">
            {birthdayHeadline || `Happy Birthday, ${recipientName}! 🎂✨`}
          </span>
        </motion.h1>

        {/* The Emotional Quote */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl mx-auto my-6 p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-pink-500/30 text-pink-200 text-[10px] font-mono tracking-widest uppercase">
            Special Dedication
          </div>
          <p className="text-base sm:text-xl font-serif-custom italic text-purple-100 leading-relaxed font-light">
            {birthdayQuote}
          </p>
        </motion.div>

        {/* Interactive Birthday Cake */}
        <div className="my-8 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={handleBlowCandles}
            className="cursor-pointer relative group flex flex-col items-center"
          >
            {/* Candles & Flame */}
            <div className="flex gap-4 sm:gap-6 mb-1">
              {[1, 2, 3].map((candle) => (
                <div key={candle} className="flex flex-col items-center relative">
                  {candlesLit ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 1],
                        rotate: [-3, 3, -3],
                        opacity: [0.9, 1, 0.9],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8 + candle * 0.15,
                        ease: 'easeInOut',
                      }}
                      className="w-4 h-6 rounded-full bg-gradient-to-t from-amber-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_#fbbf24] flex items-center justify-center cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-200" />
                    </motion.div>
                  ) : (
                    <div className="w-2 h-3 rounded-full bg-stone-500/60 opacity-60 relative">
                      {/* Smoke particles */}
                      <motion.div
                        initial={{ opacity: 0.8, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -20, scale: 2 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 left-0 text-white/50 text-[10px]"
                      >
                        💨
                      </motion.div>
                    </div>
                  )}
                  {/* Candle Body */}
                  <div className="w-2.5 h-7 sm:h-9 bg-gradient-to-b from-pink-300 to-purple-400 rounded-t-sm shadow-sm" />
                </div>
              ))}
            </div>

            {/* Cake Base */}
            <div className="relative">
              <div className="w-36 sm:w-48 h-14 sm:h-18 rounded-t-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 shadow-xl border-t-2 border-white/40 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🎂</span>
                <div className="absolute inset-x-2 bottom-0 h-4 bg-white/20 rounded-b-lg blur-[1px]" />
              </div>
              <div className="w-44 sm:w-56 h-4 bg-white/30 rounded-full mx-auto -mt-1 shadow-md backdrop-blur-sm" />
            </div>

            {/* Instruction tooltip */}
            <div className="mt-3 text-xs text-purple-200/80 group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
              {candlesLit ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span>Tap cake to make a wish & blow out the candles! 🕯️</span>
                </>
              ) : (
                <span className="text-emerald-300 font-medium">
                  ✨ Wish made! May all your dreams take flight! 🌟
                </span>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {wishMade && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-3 px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-serif-custom italic"
              >
                “Your wish has been carried into the universe… ✨”
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Audio / Confetti Action bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => {
              soundEngine.playClick();
              triggerBirthdayConfetti();
            }}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/40 text-purple-200 hover:text-white text-xs flex items-center gap-2 transition-all hover:bg-white/10 cursor-pointer"
          >
            <PartyPopper className="w-3.5 h-3.5 text-pink-400" />
            <span>More Confetti! 🎉</span>
          </button>

          <button
            onClick={handleReplaySong}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/40 text-purple-200 hover:text-white text-xs flex items-center gap-2 transition-all hover:bg-white/10 cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span>Replay Birthday Song 🎵</span>
          </button>
        </div>

        {/* Primary Proceed CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(236,72,153,0.7)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundEngine.playChime();
            onProceedToMemories();
          }}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-pink-500/30 flex items-center justify-center gap-3 mx-auto cursor-pointer"
        >
          <span>Open Our Precious Memories 📸</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </motion.button>
      </div>
    </motion.div>
  );
};
