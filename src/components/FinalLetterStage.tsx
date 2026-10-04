'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, Send, RotateCcw, Share2, Check, Download, PartyPopper } from 'lucide-react';
import { BirthdayLetter } from '@/types';
import { soundEngine } from '@/utils/soundEngine';
import { triggerBirthdayConfetti, triggerHeartBurst, triggerStarBurst } from '@/utils/confetti';

interface FinalLetterStageProps {
  letter: BirthdayLetter;
  recipientName: string;
  onRestart: () => void;
}

export const FinalLetterStage: React.FC<FinalLetterStageProps> = ({
  letter,
  recipientName,
  onRestart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playChime();
    triggerHeartBurst(0.5, 0.4);
    setTimeout(() => {
      triggerStarBurst(0.5, 0.6);
    }, 400);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    soundEngine.playFanfare();
    triggerBirthdayConfetti();
    setReplySent(true);
    setTimeout(() => {
      setShowReplyModal(false);
      setReplySent(false);
      setReplyText('');
    }, 2500);
  };

  const handleCopyLetter = () => {
    soundEngine.playClick();
    const fullText = `${letter.greeting}\n\n${letter.paragraphs.join('\n\n')}\n\n${letter.highlightQuote}\n\n${letter.closing}\n${letter.sender}\n\n${letter.postScript || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto pb-12"
    >
      {/* Top Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          The Final Chapter • Step 6 of 6
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif-custom font-bold text-white tracking-tight">
          A Message from the Heart 💌
        </h2>
        <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto">
          {isOpen ? 'Read with all the warmth in the world.' : 'Break the wax seal to unfurl your birthday letter.'}
        </p>
      </div>

      {/* ENVELOPE / SEAL INTERACTION */}
      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={handleOpenEnvelope}
          className="cursor-pointer max-w-lg mx-auto"
        >
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center relative border border-white/20 shadow-2xl group overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-transparent pointer-events-none" />

            {/* Envelope Illustration with Wax Seal */}
            <div className="relative mx-auto w-36 h-28 sm:w-44 sm:h-32 bg-gradient-to-b from-purple-900/60 to-midnight-950/90 rounded-2xl border-2 border-pink-400/40 shadow-xl flex items-center justify-center mb-6">
              {/* Envelope flap lines */}
              <div className="absolute top-0 left-0 right-0 h-14 border-b border-pink-400/30 bg-purple-950/40 rounded-t-2xl transform origin-top clip-triangle" />

              {/* Glowing Wax Seal */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 border-2 border-amber-300/60 shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center justify-center relative z-10"
              >
                <span className="font-serif-custom font-bold text-white text-lg">H</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1 -right-1 animate-spin-slow" />
              </motion.div>
            </div>

            <h3 className="text-xl font-serif-custom font-bold text-white mb-2">
              For Harshita’s Eyes Only 🔐
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 mb-4 max-w-xs mx-auto">
              Tap anywhere on this envelope to break the seal and read your heartfelt birthday letter.
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-semibold group-hover:bg-pink-500/30 transition-all shadow-glow-pink">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Click to Break Seal</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* UNFURLED LETTER CARD */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', damping: 20 }}
          className="relative"
        >
          <div className="relative rounded-3xl p-6 sm:p-12 shadow-2xl border border-white/25 overflow-hidden bg-gradient-to-b from-stone-950/90 via-[#18132b]/95 to-stone-950/95 backdrop-blur-xl">
            {/* Decorative Gold Corner Filigrees */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-pink-400/40 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-pink-400/40 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-pink-400/40 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-pink-400/40 rounded-br-xl pointer-events-none" />

            {/* Letter Header */}
            <div className="text-center pb-6 border-b border-white/10 mb-8">
              <span className="text-3xl sm:text-4xl">💌</span>
              <h3 className="text-2xl sm:text-3xl font-script text-pink-300 font-bold mt-2">
                {letter.greeting || `Dearest ${recipientName},`}
              </h3>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-5 text-sm sm:text-base leading-relaxed text-purple-100/90 font-light font-serif-custom">
              {letter.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="indent-4 first-letter:text-xl first-letter:font-bold first-letter:text-pink-300">
                  {paragraph}
                </p>
              ))}

              {/* Highlight Quote Foil Card */}
              {letter.highlightQuote && (
                <div className="my-8 p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/15 to-pink-500/10 border border-pink-400/30 text-center shadow-inner">
                  <p className="text-base sm:text-lg font-script text-pink-200 font-bold leading-relaxed">
                    {letter.highlightQuote}
                  </p>
                </div>
              )}
            </div>

            {/* Letter Sign-off */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-end text-right">
              <p className="text-xs sm:text-sm text-purple-300/80 italic font-serif-custom">
                {letter.closing || 'With endless love,'}
              </p>
              <p className="text-xl sm:text-2xl font-handwriting text-pink-300 font-bold mt-1">
                {letter.sender || 'Your Forever Bestie ❤️'}
              </p>

              {letter.postScript && (
                <p className="mt-4 text-xs text-purple-300/60 font-mono text-left w-full border-t border-white/5 pt-3">
                  {letter.postScript}
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLetter}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/40 text-purple-200 hover:text-white text-xs flex items-center gap-1.5 transition-all"
                  title="Copy Letter Text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playFanfare();
                    triggerBirthdayConfetti();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/40 text-pink-300 hover:text-white text-xs flex items-center gap-1.5 transition-all"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-pink-400" />
                  <span>Confetti Blast</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/20 flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Send a Virtual Hug 🤗</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onRestart();
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-300 hover:text-white transition-all"
                  title="Replay Experience from Start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* VIRTUAL HUG & REPLY MODAL */}
      <AnimatePresence>
        {showReplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-midnight-950 border border-pink-400/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center"
            >
              <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center mx-auto mb-4 shadow-glow-pink">
                <Heart className="w-7 h-7 fill-pink-500 text-pink-400 animate-pulse" />
              </div>

              <h3 className="text-xl font-serif-custom font-bold text-white mb-2">
                Send a Virtual Hug & Reply 💖
              </h3>
              <p className="text-xs text-purple-200/70 mb-5">
                Send an instant heart shower and heartfelt birthday response!
              </p>

              {replySent ? (
                <div className="p-6 bg-pink-500/20 border border-pink-400/40 rounded-2xl text-center space-y-2">
                  <span className="text-3xl">🤗💖✨</span>
                  <p className="text-sm font-semibold text-white">Virtual Hug Sent with Maximum Love!</p>
                  <p className="text-xs text-pink-200">You are the best Harshita in the whole universe! 🌟</p>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="space-y-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Type a cute note back, or just click Send Hug below! 💕"
                    className="w-full p-3.5 bg-black/40 border border-white/15 focus:border-pink-400 rounded-2xl text-white placeholder-purple-300/30 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReplyModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-200 text-xs hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Hug & Love!</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
