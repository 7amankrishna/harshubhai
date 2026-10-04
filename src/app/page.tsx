'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExperienceStage, SurpriseConfig } from '@/types';
import { defaultConfig } from '@/data/defaultConfig';
import { soundEngine } from '@/utils/soundEngine';
import { BackgroundStars } from '@/components/BackgroundStars';
import { NavigationHeader } from '@/components/NavigationHeader';
import { PasswordStage } from '@/components/PasswordStage';
import { PuzzleStage } from '@/components/PuzzleStage';
import { QuestionStage } from '@/components/QuestionStage';
import { BirthdayRevealStage } from '@/components/BirthdayRevealStage';
import { MemoriesGalleryStage } from '@/components/MemoriesGalleryStage';
import { FinalLetterStage } from '@/components/FinalLetterStage';
import { SettingsModal } from '@/components/SettingsModal';

const STAGE_ORDER: ExperienceStage[] = [
  'password',
  'puzzle',
  'question',
  'reveal',
  'memories',
  'letter',
];

export default function Home() {
  const [config, setConfig] = useState<SurpriseConfig>(defaultConfig);
  const [currentStage, setCurrentStage] = useState<ExperienceStage>('password');
  const [highestStageReached, setHighestStageReached] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load saved config & sound preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('harshubhai_surprise_config_v3');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // Use latest default configuration
        setConfig(defaultConfig);
      }
    } catch {
      // Ignore parse errors
    }
    setHasLoaded(true);
  }, []);

  const handleSaveConfig = (newConfig: SurpriseConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('harshubhai_surprise_config_v3', JSON.stringify(newConfig));
    } catch {
      // Ignore
    }
  };

  const advanceToStage = (nextStage: ExperienceStage) => {
    const nextIdx = STAGE_ORDER.indexOf(nextStage);
    if (nextIdx > highestStageReached) {
      setHighestStageReached(nextIdx);
    }
    setCurrentStage(nextStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
    if (newMuted) {
      setIsBgmPlaying(false);
    }
  };

  const handleToggleBgm = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
    const playing = soundEngine.toggleBgm();
    setIsBgmPlaying(playing);
  };

  const handleRestart = () => {
    soundEngine.playChime();
    setCurrentStage('password');
    setHighestStageReached(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-purple-300">
        <div className="animate-spin text-3xl">✨</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Dynamic Starry Night Sky Canvas */}
      <BackgroundStars />

      {/* Top Navigation & Status Bar */}
      <NavigationHeader
        currentStage={currentStage}
        highestStageReached={highestStageReached}
        onNavigateStage={(stage) => {
          setCurrentStage(stage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        recipientName={config.recipientName}
      />

      {/* Main Experience Container */}
      <div className="relative z-10 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* STAGE 1: Password / Secret Gate */}
          {currentStage === 'password' && (
            <PasswordStage
              key="password"
              recipientName={config.recipientName}
              passwords={config.passwords}
              passwordHint={config.passwordHint}
              onSuccess={() => advanceToStage('puzzle')}
            />
          )}

          {/* STAGE 2: Scrambled Photo Puzzle */}
          {currentStage === 'puzzle' && (
            <PuzzleStage
              key="puzzle"
              puzzleImage={config.puzzleImage}
              gridSize={config.puzzleGridSize || 3}
              onSuccess={() => advanceToStage('question')}
            />
          )}

          {/* STAGE 3: Personal Question */}
          {currentStage === 'question' && (
            <QuestionStage
              key="question"
              questionData={config.question}
              recipientName={config.recipientName}
              onSuccess={() => advanceToStage('reveal')}
            />
          )}

          {/* STAGE 4: Grand Birthday Reveal */}
          {currentStage === 'reveal' && (
            <BirthdayRevealStage
              key="reveal"
              recipientName={config.recipientName}
              birthdayHeadline={config.birthdayHeadline}
              birthdayQuote={config.birthdayQuote}
              onProceedToMemories={() => advanceToStage('memories')}
            />
          )}

          {/* STAGE 5: Precious Memories Gallery */}
          {currentStage === 'memories' && (
            <MemoriesGalleryStage
              key="memories"
              memories={config.memories}
              recipientName={config.recipientName}
              onProceedToLetter={() => advanceToStage('letter')}
            />
          )}

          {/* STAGE 6: Heartfelt Final Letter */}
          {currentStage === 'letter' && (
            <FinalLetterStage
              key="letter"
              letter={config.birthdayLetter}
              recipientName={config.recipientName}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Global Quick Action Floating Bar (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundEngine.playClick();
            setIsSettingsOpen(true);
          }}
          className="p-3 rounded-full bg-midnight-900/80 backdrop-blur-md border border-white/20 text-purple-200 hover:text-white hover:border-pink-400 shadow-xl flex items-center gap-2 text-xs font-medium cursor-pointer"
          title="Customize Birthday Details"
        >
          <span className="text-sm">⚙️</span>
          <span className="hidden sm:inline">Customize</span>
        </motion.button>
      </div>

      {/* Settings & Customization Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onJumpToStage={(stage) => {
          advanceToStage(stage);
        }}
      />

      {/* Ambient Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-purple-300/40">
        <p>Made with endless love & laughter for Harshita&rsquo;s Birthday ❤️✨</p>
      </footer>
    </main>
  );
}
