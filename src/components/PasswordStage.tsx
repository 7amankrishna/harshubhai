'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Heart, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/utils/soundEngine';
import { triggerHeartBurst } from '@/utils/confetti';

interface PasswordStageProps {
  recipientName: string;
  passwords: string[];
  passwordHint: string;
  onSuccess: () => void;
}

const PLAYFUL_ERRORS = [
  'Nope! Think about your absolute favorite crispy food 🫓🤭',
  'Nice try, sneaky! But you know the secret nickname 👀',
  'Close, but no Menduvada! Want a hint? Click the key below 🔑',
  'Are you really Harshita or just a hungry imposter? 😜',
  'Wrong passcode! Even our inside jokes are easier than this 😂',
];

export const PasswordStage: React.FC<PasswordStageProps> = ({
  recipientName,
  passwords,
  passwordHint,
  onSuccess,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Normalize input string: lowercase, remove all spaces, underscores, and hyphens
  const normalize = (str: string) => str.toLowerCase().replace(/[\s\-_]+/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMessage('Please type the secret password first! 🫓✨');
      soundEngine.playError();
      return;
    }

    const cleanInput = normalize(inputVal);
    const normalizedPasswords = passwords.map(normalize);

    const isMatch = normalizedPasswords.some(
      (p) => cleanInput === p || cleanInput.includes(p) || p.includes(cleanInput)
    );

    if (isMatch) {
      setErrorMessage(null);
      setIsUnlocking(true);
      soundEngine.playChime();
      triggerHeartBurst(0.5, 0.5);

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      soundEngine.playError();
      setIsShaking(true);
      const randomErr = PLAYFUL_ERRORS[Math.floor(Math.random() * PLAYFUL_ERRORS.length)];
      setErrorMessage(randomErr);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center border border-white/20">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-pink-500 to-transparent blur-sm" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Animated Lock Icon */}
        <motion.div
          animate={
            isUnlocking
              ? { scale: [1, 1.25, 0.9], rotate: [0, -10, 10, 0] }
              : { y: [0, -6, 0] }
          }
          transition={{ duration: isUnlocking ? 0.8 : 3, repeat: isUnlocking ? 0 : Infinity }}
          className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/30 to-pink-400/20 border border-pink-400/30 flex items-center justify-center shadow-lg shadow-pink-500/20 relative group"
        >
          <div className="absolute inset-0 rounded-2xl bg-pink-500/20 blur-md group-hover:bg-pink-500/30 transition-all" />
          {isUnlocking ? (
            <Sparkles className="w-10 h-10 text-pink-300 animate-spin" />
          ) : (
            <Lock className="w-9 h-9 text-pink-300 drop-shadow-md" />
          )}
          <span className="absolute -top-1 -right-1 text-base">🫓</span>
        </motion.div>

        {/* Title & Tagline */}
        <div className="space-y-2 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium tracking-wider uppercase mb-1"
          >
            <Sparkles className="w-3 h-3" />
            Stage 1 • Secret Birthday Vault
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-serif-custom font-bold text-white tracking-tight">
            A little surprise is waiting for{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              {recipientName}…
            </span>
          </h2>
          <p className="text-sm text-purple-200/70 max-w-sm mx-auto leading-relaxed">
            Enter your secret password to unlock the memories vault 🗝️✨
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative flex items-center">
              <span className="absolute left-4 text-purple-300/60">
                <Key className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter secret word (e.g. MenduVada)..."
                disabled={isUnlocking}
                autoFocus
                className="w-full pl-11 pr-12 py-3.5 bg-black/40 border border-white/15 focus:border-pink-400/80 rounded-2xl text-white placeholder-purple-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-purple-300/60 hover:text-purple-200 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Error Message with Shake */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                className="flex items-center justify-center gap-2 text-rose-300 bg-rose-500/10 border border-rose-500/20 py-2.5 px-4 rounded-xl text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(236,72,153,0.5)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isUnlocking}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer disabled:opacity-70"
          >
            {isUnlocking ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-pink-200" />
                <span>Unlocking the Vault...</span>
              </>
            ) : (
              <>
                <span>Unlock Surprise</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Hint / Quick helper */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowHint(!showHint);
            }}
            className="text-xs text-purple-300/70 hover:text-pink-300 transition-colors flex items-center gap-1.5 underline decoration-dotted underline-offset-4"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>{showHint ? 'Hide hint' : 'Need a little hint? 🫓'}</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 bg-purple-900/30 border border-purple-400/20 rounded-xl text-xs text-purple-200/90 leading-relaxed max-w-xs"
              >
                💡 <span className="font-medium text-pink-300">{passwordHint}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
