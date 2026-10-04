'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, Upload, Image as ImageIcon, Sparkles, Key, HelpCircle, Film, Heart, Check, Plus, Trash2, Music, Play, Square } from 'lucide-react';
import { SurpriseConfig, ExperienceStage, MemoryItem } from '@/types';
import { defaultConfig } from '@/data/defaultConfig';
import { soundEngine } from '@/utils/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SurpriseConfig;
  onSaveConfig: (newConfig: SurpriseConfig) => void;
  onJumpToStage: (stage: ExperienceStage) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onJumpToStage,
}) => {
  const [formData, setFormData] = useState<SurpriseConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'general' | 'puzzle' | 'question' | 'audio' | 'memories' | 'letter' | 'preview'>('general');
  const [saveToast, setSaveToast] = useState(false);
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playChime();
    onSaveConfig(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    soundEngine.playClick();
    if (confirm('Reset everything back to default configuration?')) {
      setFormData({ ...defaultConfig });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'puzzle' | 'audio' | number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'puzzle') {
          setFormData((prev) => ({ ...prev, puzzleImage: result }));
        } else if (target === 'audio') {
          setFormData((prev) => ({ ...prev, bgMusicUrl: result }));
        } else if (typeof target === 'number') {
          const updatedMemories = [...formData.memories];
          if (updatedMemories[target]) {
            updatedMemories[target].imageUrl = result;
            setFormData((prev) => ({ ...prev, memories: updatedMemories }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = () => {
    soundEngine.playClick();
    const newMemory: MemoryItem = {
      id: `m_${Date.now()}`,
      title: 'New Memory with MenduVada ✨',
      date: 'Special Moment',
      caption: 'Another unforgettable memory filled with laughs and snacks.',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
      tag: '💖 Memory',
      likes: 15,
      highlight: 'A moment that makes us smile looking back.'
    };
    setFormData((prev) => ({ ...prev, memories: [...prev.memories, newMemory] }));
  };

  const handleDeleteMemory = (index: number) => {
    soundEngine.playClick();
    setFormData((prev) => ({
      ...prev,
      memories: prev.memories.filter((_, idx) => idx !== index),
    }));
  };

  const handleTestAudio = () => {
    if (formData.bgMusicUrl) {
      if (isPlayingTestAudio && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingTestAudio(false);
      } else {
        if (!audioRef.current) {
          audioRef.current = new Audio(formData.bgMusicUrl);
        } else {
          audioRef.current.src = formData.bgMusicUrl;
        }
        audioRef.current.play().then(() => setIsPlayingTestAudio(true)).catch(() => {});
        audioRef.current.onended = () => setIsPlayingTestAudio(false);
      }
    } else {
      soundEngine.playHappyBirthdaySong();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="bg-midnight-950 border border-purple-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-midnight-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif-custom font-bold text-white">
                  Customize Surprise Vault ⚙️
                </h3>
                <p className="text-xs text-purple-300/70">
                  Easily replace photos, password, quiz questions, audio, and messages!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10 bg-black/30 px-4 py-2 gap-2 text-xs">
            {[
              { id: 'general', label: '1. Password & Details', icon: Key },
              { id: 'puzzle', label: '2. Puzzle Image', icon: ImageIcon },
              { id: 'question', label: '3. Serious Question', icon: HelpCircle },
              { id: 'audio', label: '4. Birthday Audio', icon: Music },
              { id: 'memories', label: '5. Memories Gallery', icon: Film },
              { id: 'letter', label: '6. Letter & Sign-off', icon: Heart },
              { id: 'preview', label: '⚡ Fast Stage Jump', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-purple-100">
            {/* TAB 1: General & Password */}
            {activeTab === 'general' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Cute Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Accepted Passwords (comma-separated, case & space insensitive)
                  </label>
                  <input
                    type="text"
                    value={formData.passwords.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passwords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. MenduVada, meduvada, Mendu Vada, harshu"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-purple-300/60 mt-1">
                    Supports any variation (with/without spaces, capitalization) like &quot;MenduVada&quot;, &quot;meduvada&quot;, &quot;Medu Vada&quot;.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Password Hint (shown when she clicks &ldquo;Need a hint?&rdquo;)
                  </label>
                  <input
                    type="text"
                    value={formData.passwordHint}
                    onChange={(e) =>
                      setFormData({ ...formData, passwordHint: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Puzzle */}
            {activeTab === 'puzzle' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Puzzle Image URL or Upload Custom Photo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.puzzleImage}
                      onChange={(e) =>
                        setFormData({ ...formData, puzzleImage: e.target.value })
                      }
                      placeholder="Paste image URL here..."
                      className="flex-1 px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                    />
                    <label className="px-4 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 rounded-xl text-xs text-purple-200 cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'puzzle')}
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Thumbnail */}
                <div className="p-4 bg-black/30 border border-white/10 rounded-2xl flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/20">
                    <img
                      src={formData.puzzleImage}
                      alt="Puzzle Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Current Puzzle Photo</h5>
                    <p className="text-[11px] text-purple-300/70 mt-1">
                      This photo is scrambled into a 3x3 interactive jigsaw tile puzzle for Stage 2.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Question */}
            {activeTab === 'question' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Serious Question
                  </label>
                  <input
                    type="text"
                    value={formData.question.text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question: { ...formData.question, text: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-purple-300">
                    Multiple Choice Options (Select radio to set the correct answer)
                  </label>
                  {formData.question.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={formData.question.correctIndex === idx}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            question: { ...formData.question, correctIndex: idx },
                          })
                        }
                        className="accent-pink-500 w-4 h-4 cursor-pointer"
                        title="Set as correct answer"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formData.question.options];
                          updated[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            question: { ...formData.question, options: updated },
                          });
                        }}
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Hint
                  </label>
                  <input
                    type="text"
                    value={formData.question.hint}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question: { ...formData.question, hint: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Explanation when solved
                  </label>
                  <input
                    type="text"
                    value={formData.question.explanation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question: { ...formData.question, explanation: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Audio */}
            {activeTab === 'audio' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Custom Birthday Song Audio URL or Upload MP3
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.bgMusicUrl || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bgMusicUrl: e.target.value })
                      }
                      placeholder="Paste MP3 audio URL (or leave empty to use built-in synthesizer)..."
                      className="flex-1 px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                    />
                    <label className="px-4 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 rounded-xl text-xs text-purple-200 cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Upload MP3</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'audio')}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-purple-300/60 mt-1">
                    If no custom audio is provided, the website automatically plays the dreamy built-in Web Audio API Happy Birthday melody!
                  </p>
                </div>

                <div className="p-4 bg-black/30 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-white text-xs">Test Audio Playback</h5>
                    <p className="text-[11px] text-purple-300/70">
                      {formData.bgMusicUrl ? 'Testing custom uploaded audio' : 'Testing built-in music-box synth'}
                    </p>
                  </div>
                  <button
                    onClick={handleTestAudio}
                    className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {isPlayingTestAudio ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingTestAudio ? 'Stop Audio' : 'Play Preview'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: Memories */}
            {activeTab === 'memories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Memories Cards</h4>
                    <p className="text-xs text-purple-300/70">
                      Add, edit, or upload photos for each memory milestone.
                    </p>
                  </div>
                  <button
                    onClick={handleAddMemory}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Memory</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.memories.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-pink-300 font-semibold">
                          Memory #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteMemory(idx)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Memory"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-purple-300/70 mb-1">Title</label>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => {
                              const updated = [...formData.memories];
                              updated[idx].title = e.target.value;
                              setFormData({ ...formData, memories: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-purple-300/70 mb-1">Date / Tag</label>
                          <input
                            type="text"
                            value={m.date}
                            onChange={(e) => {
                              const updated = [...formData.memories];
                              updated[idx].date = e.target.value;
                              setFormData({ ...formData, memories: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-purple-300/70 mb-1">
                          Photo URL or Upload
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={m.imageUrl}
                            onChange={(e) => {
                              const updated = [...formData.memories];
                              updated[idx].imageUrl = e.target.value;
                              setFormData({ ...formData, memories: updated });
                            }}
                            className="flex-1 px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none"
                          />
                          <label className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs text-purple-200 cursor-pointer flex items-center gap-1 shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, idx)}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-purple-300/70 mb-1">Caption</label>
                        <textarea
                          rows={2}
                          value={m.caption}
                          onChange={(e) => {
                            const updated = [...formData.memories];
                            updated[idx].caption = e.target.value;
                            setFormData({ ...formData, memories: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Letter */}
            {activeTab === 'letter' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Letter Greeting
                  </label>
                  <input
                    type="text"
                    value={formData.birthdayLetter.greeting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthdayLetter: { ...formData.birthdayLetter, greeting: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Letter Paragraphs
                  </label>
                  {formData.birthdayLetter.paragraphs.map((p, idx) => (
                    <div key={idx} className="mb-2">
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const updated = [...formData.birthdayLetter.paragraphs];
                          updated[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            birthdayLetter: { ...formData.birthdayLetter, paragraphs: updated },
                          });
                        }}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Highlighted Quote (Gold foil box)
                  </label>
                  <input
                    type="text"
                    value={formData.birthdayLetter.highlightQuote}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthdayLetter: { ...formData.birthdayLetter, highlightQuote: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">
                      Closing Line
                    </label>
                    <input
                      type="text"
                      value={formData.birthdayLetter.closing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birthdayLetter: { ...formData.birthdayLetter, closing: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">
                      Signature
                    </label>
                    <input
                      type="text"
                      value={formData.birthdayLetter.sender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birthdayLetter: { ...formData.birthdayLetter, sender: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-pink-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: Preview / Stage Jumper */}
            {activeTab === 'preview' && (
              <div className="space-y-4 max-w-xl mx-auto text-center">
                <h4 className="text-sm font-semibold text-white">Direct Stage Jumper ⚡</h4>
                <p className="text-xs text-purple-300/70">
                  Jump directly to any section of the surprise experience for testing or immediate preview:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {[
                    { id: 'password', label: '1. Password 🔐' },
                    { id: 'puzzle', label: '2. Puzzle 🧩' },
                    { id: 'question', label: '3. Question ❓' },
                    { id: 'reveal', label: '4. Reveal 🎂' },
                    { id: 'memories', label: '5. Memories 📸' },
                    { id: 'letter', label: '6. Letter 💌' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundEngine.playClick();
                        onJumpToStage(s.id as ExperienceStage);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-pink-600/30 border border-white/10 hover:border-pink-400/50 text-xs font-medium text-purple-100 transition-all hover:scale-105"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-midnight-900/50 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-rose-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/20 flex items-center gap-1.5 hover:scale-105 transition-transform"
              >
                {saveToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
