'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, CheckCircle2, ArrowRight, Lightbulb, MessageSquare, ListCheck } from 'lucide-react';
import { QuestionData } from '@/types';
import { soundEngine } from '@/utils/soundEngine';
import { triggerHeartBurst, triggerStarBurst } from '@/utils/confetti';

interface QuestionStageProps {
  questionData: QuestionData;
  recipientName: string;
  onSuccess: () => void;
}

const FUNNY_OPTION_RESPONSES: { [key: number]: string } = {
  0: 'Zombie Harshu detected! 🧟‍♀️ While you do love eating brains, think crispier!',
  1: 'Cannibal Harshu strikes again! 🧠😂 But nope, think round with a hole in the middle!',
  3: 'Suspicious indeed... 👀 but not quite the queen of all South Indian delicacies!',
};

export const QuestionStage: React.FC<QuestionStageProps> = ({
  questionData,
  recipientName,
  onSuccess,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState<number | null>(null);
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);

  // Text input mode
  const [mode, setMode] = useState<'multiple' | 'text'>('multiple');
  const [textAnswer, setTextAnswer] = useState('');
  const [textError, setTextError] = useState<string | null>(null);

  const handleSelectOption = (index: number) => {
    if (isCorrect) return;

    setSelectedIdx(index);
    setIsAnswered(true);

    if (index === questionData.correctIndex) {
      setIsCorrect(true);
      setWrongAttempt(null);
      setCustomFeedback(null);
      soundEngine.playFanfare();
      triggerHeartBurst(0.5, 0.4);
      setTimeout(() => triggerStarBurst(0.5, 0.5), 300);
    } else {
      setIsCorrect(false);
      setWrongAttempt(index);
      setCustomFeedback(FUNNY_OPTION_RESPONSES[index] || questionData.hint);
      soundEngine.playError();
      setShowHint(true);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCorrect) return;
    if (!textAnswer.trim()) {
      setTextError('Please type your favorite food! 🫓');
      soundEngine.playError();
      return;
    }

    const clean = textAnswer.trim().toLowerCase().replace(/[\s\-_]+/g, '');
    const keywords = questionData.freeTextKeywords || ['menduvada', 'meduvada', 'vada', 'mendu'];
    const isKeywordMatch = keywords.some((k) => clean.includes(k.toLowerCase().replace(/[\s\-_]+/g, '')));

    if (isKeywordMatch) {
      setIsCorrect(true);
      setTextError(null);
      setCustomFeedback(null);
      soundEngine.playFanfare();
      triggerHeartBurst(0.5, 0.4);
    } else if (clean.includes('brain') || clean.includes('human')) {
      soundEngine.playError();
      setTextError('Zombie mode active! 🧠 But nope, think fried & crispy!');
      setShowHint(true);
    } else {
      soundEngine.playError();
      setTextError(questionData.hint || 'Think of the crispy golden snack with chutney! 🫓');
      setShowHint(true);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/20">
        {/* Glow Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Stage 3 • The Extremely Serious Question 😂
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-custom font-bold text-white tracking-tight">
            Only the real <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">{recipientName}</span> knows… ❓✨
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto">
            Answer this high-stakes dietary interrogation to unlock the grand birthday reveal!
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-full text-xs">
            <button
              onClick={() => {
                soundEngine.playClick();
                setMode('multiple');
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                mode === 'multiple'
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <ListCheck className="w-3.5 h-3.5" />
              <span>Multiple Choice</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setMode('text');
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                mode === 'text'
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Type Answer</span>
            </button>
          </div>
        </div>

        {/* Question Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 text-center">
          <p className="text-base sm:text-lg font-medium text-purple-100 font-serif-custom italic">
            “{questionData.text}”
          </p>
        </div>

        {/* Multiple Choice Mode */}
        {mode === 'multiple' && (
          <div className="space-y-3 mb-6">
            {questionData.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const isOptionCorrect = idx === questionData.correctIndex;
              const isWrong = isSelected && !isOptionCorrect && wrongAttempt === idx;

              return (
                <motion.button
                  key={idx}
                  whileHover={!isCorrect ? { scale: 1.01 } : {}}
                  whileTap={!isCorrect ? { scale: 0.99 } : {}}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isCorrect}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 cursor-pointer relative overflow-hidden ${
                    isCorrect && isOptionCorrect
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-glow-gold'
                      : isWrong
                      ? 'bg-rose-500/20 border-rose-400/80 text-rose-200 animate-pulse'
                      : 'bg-black/30 border-white/10 text-purple-100 hover:border-pink-400/50 hover:bg-white/[0.06]'
                  }`}
                >
                  {/* Option letter pill */}
                  <div
                    className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCorrect && isOptionCorrect
                        ? 'bg-emerald-500 text-white'
                        : isWrong
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/10 text-purple-300'
                    }`}
                  >
                    {isCorrect && isOptionCorrect ? '✓' : optionLetters[idx]}
                  </div>

                  <span className="text-sm font-medium flex-1">{option}</span>

                  {isCorrect && isOptionCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-400 shrink-0"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Text Mode */}
        {mode === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4 mb-6">
            <div className="relative">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => {
                  setTextAnswer(e.target.value);
                  if (textError) setTextError(null);
                }}
                disabled={isCorrect}
                placeholder="Type your favorite food (e.g. Menduvada)..."
                className="w-full p-4 bg-black/40 border border-white/15 focus:border-pink-400 rounded-2xl text-white placeholder-purple-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            {textError && (
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {textError}
              </div>
            )}

            {!isCorrect && (
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white text-sm font-semibold hover:shadow-glow-pink transition-all"
              >
                Submit Answer 🫓
              </button>
            )}
          </form>
        )}

        {/* Custom Feedback or Hint Box */}
        <AnimatePresence>
          {showHint && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="p-3.5 mb-6 bg-amber-500/10 border border-amber-400/25 rounded-2xl flex items-start gap-2.5 text-amber-200 text-xs"
            >
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">
                  {customFeedback ? 'Funny Reaction 😂' : 'Cute Hint 💡'}
                </p>
                <p className="mt-0.5">{customFeedback || questionData.hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Correct Celebration & Proceed Box */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-midnight-950/80 border border-pink-400/40 text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Identity Confirmed • MenduVada Queen Verified! 🫓🎉
              </div>

              <p className="text-sm text-purple-100 font-serif-custom italic">
                “{questionData.explanation}”
              </p>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(236,72,153,0.7)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundEngine.playChime();
                  onSuccess();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>Trigger Birthday Reveal! 🎂🎉</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
