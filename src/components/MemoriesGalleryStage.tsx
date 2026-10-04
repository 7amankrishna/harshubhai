'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles, LayoutGrid, SlidersHorizontal, Maximize2, RotateCw, ArrowRight, X, Calendar, MapPin } from 'lucide-react';
import { MemoryItem } from '@/types';
import { soundEngine } from '@/utils/soundEngine';
import { triggerHeartBurst } from '@/utils/confetti';

interface MemoriesGalleryStageProps {
  memories: MemoryItem[];
  recipientName: string;
  onProceedToLetter: () => void;
}

export const MemoriesGalleryStage: React.FC<MemoriesGalleryStageProps> = ({
  memories,
  recipientName,
  onProceedToLetter,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const [likes, setLikes] = useState<{ [key: string]: number }>(
    memories.reduce((acc, m) => ({ ...acc, [m.id]: m.likes || 10 }), {})
  );
  const [activeLightbox, setActiveLightbox] = useState<MemoryItem | null>(null);

  const handleNext = () => {
    soundEngine.playClick();
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    soundEngine.playClick();
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleToggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playClick();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playClick();
    triggerHeartBurst(0.5, 0.7);
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const currentMemory = memories[currentIndex] || memories[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto pb-6"
    >
      {/* Top Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Precious Scrapbook • Step 5 of 6
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif-custom font-bold text-white tracking-tight">
          Moments With <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">{recipientName}</span> 📸✨
        </h2>
        <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto">
          Every photo tells a chapter of laughter, chaos, and genuine love.
        </p>

        {/* View Mode Toggle */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-full text-xs">
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('carousel');
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                viewMode === 'carousel'
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Carousel Slider</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('grid');
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Scrapbook Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* CAROUSEL VIEW */}
      {viewMode === 'carousel' && (
        <div className="relative">
          <div className="flex items-center justify-center">
            {/* Left Nav Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:-left-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-midnight-900/80 border border-white/20 hover:border-pink-400 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer"
              title="Previous Memory"
            >
              <ChevronLeft className="w-6 h-6 text-pink-300" />
            </button>

            {/* Main Featured Card with 3D Flip */}
            <div className="w-full max-w-lg perspective-1000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMemory.id}
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <div
                    className={`glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/20 transition-all duration-500 transform-style-preserve-3d ${
                      flippedCards[currentMemory.id] ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front of Card */}
                    <div className={flippedCards[currentMemory.id] ? 'hidden' : 'block'}>
                      {/* Photo Container */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border border-white/10 group mb-4">
                        <img
                          src={currentMemory.imageUrl}
                          alt={currentMemory.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-300">
                            {currentMemory.tag || '✨ Memory'}
                          </span>
                          <button
                            onClick={() => setActiveLightbox(currentMemory)}
                            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:scale-110 transition-all"
                            title="Expand Photo"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Location */}
                        {currentMemory.location && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            <span>{currentMemory.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-purple-300/70">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                            <span>{currentMemory.date}</span>
                          </div>

                          {/* Like reaction button */}
                          <button
                            onClick={(e) => handleLike(currentMemory.id, e)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-semibold transition-all group"
                          >
                            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-400 group-hover:scale-125 transition-transform" />
                            <span>{likes[currentMemory.id] || 0}</span>
                          </button>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif-custom font-bold text-white tracking-tight">
                          {currentMemory.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-light">
                          “{currentMemory.caption}”
                        </p>

                        {/* Flip Card Action */}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={(e) => handleToggleFlip(currentMemory.id, e)}
                            className="text-xs text-purple-300 hover:text-pink-300 flex items-center gap-1.5 underline decoration-dotted underline-offset-4 font-medium"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Read Backstory</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card (Story View) */}
                    {flippedCards[currentMemory.id] && (
                      <div className="rotate-y-180 min-h-[380px] flex flex-col justify-between p-3 text-left">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-xs font-mono uppercase text-pink-300">
                              Inside Story 📖
                            </span>
                            <button
                              onClick={(e) => handleToggleFlip(currentMemory.id, e)}
                              className="text-xs text-purple-300 hover:text-white flex items-center gap-1"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Back to photo</span>
                            </button>
                          </div>

                          <h4 className="text-xl font-serif-custom font-bold text-white">
                            {currentMemory.title}
                          </h4>

                          <p className="text-sm text-purple-100 font-serif-custom italic leading-relaxed">
                            {currentMemory.highlight ||
                              'A snapshot in time that we will cherish for the rest of our lives. No matter how much time passes, moments like this define what true friendship feels like.'}
                          </p>

                          <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-400/20 text-xs text-purple-200">
                            🌟 <span className="italic">“Some memories don’t need words, just a smile looking back.”</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-purple-300/60">{currentMemory.date}</span>
                          <button
                            onClick={(e) => handleLike(currentMemory.id, e)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold"
                          >
                            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                            <span>Send Love (+1)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Nav Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-midnight-900/80 border border-white/20 hover:border-pink-400 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer"
              title="Next Memory"
            >
              <ChevronRight className="w-6 h-6 text-pink-300" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {memories.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-pink-500 shadow-glow-pink' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Jump to ${m.title}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* GRID / SCRAPBOOK VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {memories.map((m) => (
            <motion.div
              key={m.id}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/15 p-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 mb-3 cursor-pointer group"
                onClick={() => setActiveLightbox(m)}
              >
                <img
                  src={m.imageUrl}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] text-pink-300 font-semibold border border-white/20">
                  {m.tag}
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <span className="text-[11px] text-purple-300/60 block">{m.date}</span>
                <h4 className="text-base font-serif-custom font-bold text-white line-clamp-1">
                  {m.title}
                </h4>
                <p className="text-xs text-purple-200/80 line-clamp-2">“{m.caption}”</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={() => setActiveLightbox(m)}
                  className="text-xs text-purple-300 hover:text-white"
                >
                  View Large
                </button>
                <button
                  onClick={(e) => handleLike(m.id, e)}
                  className="flex items-center gap-1 text-xs text-pink-300 hover:scale-110 transition-transform"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  <span>{likes[m.id] || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveLightbox(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-midnight-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-pink-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeLightbox.imageUrl}
                  alt={activeLightbox.title}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 space-y-2 bg-gradient-to-b from-midnight-900 to-midnight-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-400 font-semibold uppercase tracking-wider">
                    {activeLightbox.tag}
                  </span>
                  <span className="text-xs text-purple-300/70">{activeLightbox.date}</span>
                </div>
                <h3 className="text-2xl font-serif-custom font-bold text-white">
                  {activeLightbox.title}
                </h3>
                <p className="text-sm text-purple-200/90 leading-relaxed">
                  “{activeLightbox.caption}”
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proceed to Final Letter Stage */}
      <div className="mt-10 text-center">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(236,72,153,0.7)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundEngine.playChime();
            onProceedToLetter();
          }}
          className="px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/30 flex items-center justify-center gap-3 mx-auto cursor-pointer"
        >
          <span>Open Harshita’s Birthday Letter 💌</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
