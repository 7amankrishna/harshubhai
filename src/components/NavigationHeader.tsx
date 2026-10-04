'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceStage } from '@/types';
import { Volume2, VolumeX, Settings, Music, Sparkles } from 'lucide-react';
import { soundEngine } from '@/utils/soundEngine';

interface NavigationHeaderProps {
  currentStage: ExperienceStage;
  highestStageReached: number;
  onNavigateStage: (stage: ExperienceStage) => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  recipientName: string;
}

const STAGES: { id: ExperienceStage; label: string; icon: string; short: string }[] = [
  { id: 'password', label: 'Secret Gate', icon: '🔐', short: 'Pass' },
  { id: 'puzzle', label: 'Photo Puzzle', icon: '🧩', short: 'Puzzle' },
  { id: 'question', label: 'Inside Joke', icon: '❓', short: 'Question' },
  { id: 'reveal', label: 'Birthday Reveal', icon: '🎂', short: 'Reveal' },
  { id: 'memories', label: 'Precious Memories', icon: '📸', short: 'Memories' },
  { id: 'letter', label: 'Heartfelt Letter', icon: '💌', short: 'Letter' },
];

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentStage,
  highestStageReached,
  onNavigateStage,
  onOpenSettings,
  isMuted,
  onToggleMute,
  isBgmPlaying,
  onToggleBgm,
  recipientName,
}) => {
  const currentIdx = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 transition-all duration-300 backdrop-blur-md bg-midnight-950/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-sm font-semibold tracking-wide text-white/90">
              For <span className="text-pink-400 font-serif-custom italic font-bold">{recipientName}</span>
            </h1>
            <p className="text-[10px] text-purple-300/70 uppercase tracking-wider">A Special Birthday Story</p>
          </div>
        </div>

        {/* Story Flow Steps */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {STAGES.map((stage, idx) => {
            const isUnlocked = idx <= highestStageReached;
            const isCurrent = currentStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  if (isUnlocked) {
                    soundEngine.playClick();
                    onNavigateStage(stage.id);
                  }
                }}
                disabled={!isUnlocked}
                className={`relative group px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 scale-105'
                    : isUnlocked
                    ? 'bg-white/5 hover:bg-white/15 text-purple-200/90 cursor-pointer'
                    : 'bg-white/[0.02] text-white/20 cursor-not-allowed opacity-50'
                }`}
                title={isUnlocked ? `Go to ${stage.label}` : 'Unlock previous steps first!'}
              >
                <span className="text-sm sm:text-base">{stage.icon}</span>
                <span className="hidden md:inline">{stage.short}</span>
                {isCurrent && (
                  <motion.div
                    layoutId="activeStageGlow"
                    className="absolute inset-0 rounded-full bg-white/20 -z-10 animate-pulse"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Audio & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* BGM Ambient Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleBgm();
            }}
            className={`p-2 rounded-full border transition-all text-xs flex items-center gap-1.5 ${
              isBgmPlaying
                ? 'bg-pink-500/20 border-pink-400/50 text-pink-300 shadow-glow-pink'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
            title={isBgmPlaying ? 'Pause ambient melody' : 'Play ambient music'}
          >
            <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'animate-bounce' : ''}`} />
            <span className="hidden lg:inline text-[11px] font-medium">
              {isBgmPlaying ? 'Music On' : 'Music Off'}
            </span>
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-all hover:bg-white/10"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Customize / Config modal button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-purple-300 hover:text-white hover:border-purple-400/50 transition-all hover:bg-purple-900/40"
            title="Customize birthday details, photos, or question"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
