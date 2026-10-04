'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Sparkles, CheckCircle2, RotateCcw, Eye, Wand2, ArrowRight, Heart } from 'lucide-react';
import { soundEngine } from '@/utils/soundEngine';
import { triggerHeartBurst, triggerStarBurst } from '@/utils/confetti';
import { cssUrl } from '@/utils/cssUrl';

interface PuzzleStageProps {
  puzzleImage: string;
  gridSize?: number;
  onSuccess: () => void;
}

export const PuzzleStage: React.FC<PuzzleStageProps> = ({
  puzzleImage,
  gridSize = 3,
  onSuccess,
}) => {
  const totalPieces = gridSize * gridSize;
  // pieces state: array of length totalPieces where index is slot position, value is original piece ID (0 to totalPieces-1)
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hintSlot, setHintSlot] = useState<number | null>(null);
  const [movesCount, setMovesCount] = useState(0);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);

  // Function to create a randomized solvable permutation
  const shufflePieces = useCallback(() => {
    let arr = Array.from({ length: totalPieces }, (_, i) => i);
    // Shuffle ensuring it's not already solved
    let isSame = true;
    while (isSame) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      isSame = arr.every((val, idx) => val === idx);
    }
    setPieces(arr);
    setSelectedSlot(null);
    setIsSolved(false);
    setMovesCount(0);
    setHintSlot(null);
  }, [totalPieces]);

  useEffect(() => {
    shufflePieces();
  }, [shufflePieces]);

  // Check solved condition
  const checkSolved = useCallback(
    (currentPieces: number[]) => {
      const solved = currentPieces.every((pieceId, slotIdx) => pieceId === slotIdx);
      if (solved && !isSolved) {
        setIsSolved(true);
        soundEngine.playFanfare();
        triggerStarBurst(0.5, 0.4);
        setTimeout(() => triggerHeartBurst(0.5, 0.6), 400);
      }
      return solved;
    },
    [isSolved]
  );

  // Swap two slots
  const swapSlots = (slotA: number, slotB: number) => {
    if (slotA === slotB) return;
    const newPieces = [...pieces];
    const temp = newPieces[slotA];
    newPieces[slotA] = newPieces[slotB];
    newPieces[slotB] = temp;

    setPieces(newPieces);
    setMovesCount((m) => m + 1);
    setSelectedSlot(null);
    setHintSlot(null);
    soundEngine.playClick();
    checkSolved(newPieces);
  };

  const handleTileClick = (slotIdx: number) => {
    if (isSolved || isAutoSolving) return;

    if (selectedSlot === null) {
      setSelectedSlot(slotIdx);
      soundEngine.playClick();
    } else {
      swapSlots(selectedSlot, slotIdx);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, slotIdx: number) => {
    if (isSolved || isAutoSolving) return;
    setDraggedSlot(slotIdx);
    e.dataTransfer.setData('text/plain', slotIdx.toString());
  };

  const handleDrop = (e: React.DragEvent, targetSlotIdx: number) => {
    e.preventDefault();
    if (draggedSlot !== null) {
      swapSlots(draggedSlot, targetSlotIdx);
      setDraggedSlot(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Provide a hint: find first misplaced slot and highlight where its correct piece is currently located
  const handleProvideHint = () => {
    soundEngine.playClick();
    const misplacedSlot = pieces.findIndex((pieceId, slot) => pieceId !== slot);
    if (misplacedSlot !== -1) {
      setHintSlot(misplacedSlot);
      setTimeout(() => setHintSlot(null), 3000);
    }
  };

  // Magic solve animation: steps through swapping pieces into place
  const handleMagicSolve = async () => {
    if (isSolved || isAutoSolving) return;
    setIsAutoSolving(true);
    soundEngine.playChime();

    const targetArr = Array.from({ length: totalPieces }, (_, i) => i);
    let currentArr = [...pieces];

    for (let targetSlot = 0; targetSlot < totalPieces; targetSlot++) {
      if (currentArr[targetSlot] !== targetSlot) {
        // Find where `targetSlot` piece is currently
        const currentPos = currentArr.indexOf(targetSlot);
        if (currentPos !== -1) {
          const temp = currentArr[targetSlot];
          currentArr[targetSlot] = currentArr[currentPos];
          currentArr[currentPos] = temp;
          setPieces([...currentArr]);
          soundEngine.playClick();
          await new Promise((r) => setTimeout(r, 160));
        }
      }
    }

    setIsAutoSolving(false);
    checkSolved(targetArr);
  };

  // Count correct pieces
  const correctCount = pieces.filter((pieceId, slotIdx) => pieceId === slotIdx).length;
  const progressPercent = Math.round((correctCount / totalPieces) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-panel rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden border border-white/20">
        {/* Glow Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium uppercase tracking-wider">
            <Puzzle className="w-3.5 h-3.5" />
            Memory Lock • Step 2 of 6
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-custom font-bold text-white tracking-tight">
            Put us back together{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              🧩❤️
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto">
            Before entering the birthday vault, solve this piece of our history! Click or drag two pieces to swap them.
          </p>
        </div>

        {/* Progress & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-2">
          {/* Progress Pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs">
            <div className="w-16 h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-semibold text-pink-300">
              {correctCount}/{totalPieces}
            </span>
            <span className="text-purple-300/60 hidden xs:inline">placed</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Show Preview */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowPreview(!showPreview);
              }}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border ${
                showPreview
                  ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                  : 'bg-white/5 border-white/10 text-purple-200/70 hover:text-white hover:bg-white/10'
              }`}
              title="Show guide photo"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Hint */}
            <button
              onClick={handleProvideHint}
              disabled={isSolved || isAutoSolving}
              className="p-2 rounded-xl text-xs flex items-center gap-1.5 bg-white/5 border border-white/10 text-purple-200/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
              title="Highlight misplaced tile"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Hint</span>
            </button>

            {/* Magic Solve / Quick Solve */}
            <button
              onClick={handleMagicSolve}
              disabled={isSolved || isAutoSolving}
              className="p-2 sm:px-3 rounded-xl text-xs flex items-center gap-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 text-pink-200 hover:text-white hover:border-pink-400/60 transition-all disabled:opacity-40"
              title="Magic Auto-Solve"
            >
              <Wand2 className={`w-3.5 h-3.5 text-pink-400 ${isAutoSolving ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Magic Wand</span>
            </button>

            {/* Shuffle Reset */}
            <button
              onClick={() => {
                soundEngine.playClick();
                shufflePieces();
              }}
              disabled={isAutoSolving}
              className="p-2 rounded-xl text-xs bg-white/5 border border-white/10 text-purple-200/70 hover:text-white hover:bg-white/10 transition-all"
              title="Reshuffle puzzle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Puzzle Board Area */}
        <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] aspect-square rounded-2xl overflow-hidden p-2.5 bg-black/40 border border-white/15 shadow-2xl">
          {/* Guide Overlay when showPreview is active */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              className="absolute inset-2.5 rounded-xl z-20 pointer-events-none bg-cover bg-center border-2 border-dashed border-pink-400/70"
              style={{ backgroundImage: cssUrl(puzzleImage) }}
            >
              <div className="absolute inset-0 bg-purple-950/20 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-black/80 px-3 py-1 rounded-full text-xs text-pink-200 font-medium">
                  Guide Preview
                </span>
              </div>
            </motion.div>
          )}

          {/* Grid of tiles */}
          <div
            className="w-full h-full grid gap-1.5 rounded-xl overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {pieces.map((pieceId, slotIdx) => {
              const isSelected = selectedSlot === slotIdx;
              const isPieceCorrect = pieceId === slotIdx;
              const isHinted = hintSlot === slotIdx;

              // Calculate background offset for pieceId
              const pieceRow = Math.floor(pieceId / gridSize);
              const pieceCol = pieceId % gridSize;
              const xPercent = (pieceCol / (gridSize - 1)) * 100;
              const yPercent = (pieceRow / (gridSize - 1)) * 100;

              return (
                <div
                  key={slotIdx}
                  onClick={() => handleTileClick(slotIdx)}
                  draggable={!isSolved && !isAutoSolving}
                  onDragStart={(e) => handleDragStart(e, slotIdx)}
                  onDrop={(e) => handleDrop(e, slotIdx)}
                  onDragOver={handleDragOver}
                  className={`relative rounded-lg overflow-hidden cursor-pointer select-none transition-all duration-200 transform hover:scale-[0.98] ${
                    isSelected
                      ? 'ring-4 ring-pink-400 shadow-glow-pink scale-95 z-10'
                      : isHinted
                      ? 'ring-4 ring-amber-400 animate-pulse z-10'
                      : isPieceCorrect && !isSolved
                      ? 'ring-1 ring-emerald-400/40'
                      : 'ring-1 ring-white/10 hover:ring-white/40'
                  }`}
                  style={{
                    backgroundImage: cssUrl(puzzleImage),
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                    backgroundPosition: `${xPercent}% ${yPercent}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Correct Piece Glow Icon */}
                  {isPieceCorrect && !isSolved && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center text-[10px] text-white">
                      ✓
                    </div>
                  )}

                  {/* Slot Number watermark (small) */}
                  <span className="absolute bottom-1 left-1 px-1 rounded text-[9px] font-mono bg-black/40 text-white/50">
                    {slotIdx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Solved Overlay Card */}
          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-midnight-950/95 via-purple-950/80 to-transparent backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center mb-3 shadow-glow-pink"
                >
                  <CheckCircle2 className="w-9 h-9 text-white" />
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-serif-custom font-bold text-white mb-1">
                  We are complete! 💖
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/80 mb-5 max-w-xs">
                  Just like every scattered memory, everything falls right back into place when we’re together.
                </p>

                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(236,72,153,0.6)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    soundEngine.playChime();
                    onSuccess();
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Connection</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-purple-300/50 flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 text-pink-400 inline" />
            <span>Solved in {movesCount} moves</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
