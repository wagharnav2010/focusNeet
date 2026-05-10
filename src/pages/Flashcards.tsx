import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, BookOpen, CheckCircle, RotateCcw, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { generateFlashcards } from '../lib/gemini';
import type { Flashcard } from '../types';
import { cn } from '../lib/utils';
import { NEET_SYLLABUS, SubjectKey } from '../data/syllabus';

export function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('focusneet_flashcards');
    if (saved) {
      try {
        setFlashcards(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved flashcards");
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('focusneet_flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  const handleGenerate = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateFlashcards(topicInput, 10);
      const newCards: Flashcard[] = generated.map(card => ({
        id: `${Date.now()}-${Math.random()}`,
        front: card.front,
        back: card.back,
        status: 'new',
        topic: topicInput
      }));
      setFlashcards(prev => [...prev, ...newCards]);
      setTopicInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusUpdate = (status: 'known' | 'review') => {
    setFlashcards(prev => {
      const updated = [...prev];
      updated[currentIndex].status = status;
      return updated;
    });
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(curr => Math.min(flashcards.length - 1, curr + 1));
    }, 150); // slight delay to allow flip back before changing content
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(curr => Math.max(0, curr - 1));
    }, 150);
  };

  const clearCards = () => {
    if (window.confirm('Are you sure you want to clear all flashcards?')) {
      setFlashcards([]);
      setCurrentIndex(0);
      localStorage.removeItem('focusneet_flashcards');
    }
  };

  const knownCount = flashcards.filter(c => c.status === 'known').length;
  const reviewCount = flashcards.filter(c => c.status === 'review').length;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#5A5A40]">Flashcards</h1>
          <p className="text-[#4A4A3A]/70 mt-1 text-sm">Active recall repository for standard NCERT concepts.</p>
        </div>
        
        {flashcards.length > 0 && (
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-[#E4E3E0] shadow-sm">
            <div className="px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-[#4A4A3A]/70">{knownCount} Known</span>
            </div>
            <div className="w-px h-4 bg-[#E4E3E0]"></div>
            <div className="px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-sm font-bold text-[#4A4A3A]/70">{reviewCount} Review</span>
            </div>
            <div className="w-px h-4 bg-[#E4E3E0]"></div>
            <button onClick={clearCards} className="px-3 py-1 text-xs font-bold text-red-600 hover:text-red-800 transition-colors">
              Clear All
            </button>
          </div>
        )}
      </div>

      {flashcards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white max-w-md w-full p-8 rounded-[32px] border border-[#E4E3E0] shadow-sm text-center">
            <div className="w-16 h-16 bg-[#F5F5F0] rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="w-8 h-8 text-[#5A5A40]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#5A5A40] mb-2">Create a Deck</h2>
            <p className="text-[#4A4A3A]/70 text-sm mb-8 leading-relaxed">
              Generate AI-powered flashcards grounded in the NCERT syllabus. Enter any NEET topic below.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g., Photosynthesis, Rotational Motion"
                className="w-full px-4 py-3 rounded-2xl border border-[#E4E3E0] bg-[#F5F5F0]/50 placeholder:text-[#4A4A3A]/30 focus:outline-none focus:border-[#5A5A40]/30 focus:bg-white transition-all text-sm font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topicInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#5A5A40] disabled:bg-[#5A5A40]/50 text-white rounded-2xl font-bold transition-colors shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Generate Flashcards
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center">
          {/* Card Generator Add-on */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-2xl border border-[#E4E3E0] shadow-sm flex items-center mb-8">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Add more cards (e.g., DNA Replication)"
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm font-medium placeholder:text-[#4A4A3A]/30"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topicInput.trim()}
              className="px-4 py-2 bg-[#F5F5F0] hover:bg-[#E4E3E0] text-[#5A5A40] rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
            >
              {isGenerating ? 'Wait...' : <><Plus className="w-3 h-3" /> Add Settings</>}
            </button>
          </div>

          <div className="w-full max-w-2xl flex-1 flex flex-col relative perspective-1000">
            {/* Progress indicators above card */}
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-xs font-bold text-[#4A4A3A]/50 bg-[#F5F5F0] px-2 py-1 rounded">
                Topic: {flashcards[currentIndex].topic}
              </span>
              <span className="text-xs font-mono font-medium text-[#4A4A3A]/70">
                {currentIndex + 1} / {flashcards.length}
              </span>
            </div>

            {/* Flashcard container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <motion.div
                className="w-full h-full preserve-3d relative transition-all duration-500 ease-in-out"
                animate={{ rotateX: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className={cn(
                    "absolute inset-0 backface-hidden bg-white border rounded-[32px] shadow-sm flex flex-col items-center justify-center p-8 sm:p-12 text-center",
                    "border-[#E4E3E0]"
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A4A3A]/30 mb-6 absolute top-8">Question</p>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#5A5A40] leading-tight">
                    {flashcards[currentIndex].front}
                  </h3>
                  <p className="text-xs font-medium text-[#4A4A3A]/40 mt-8 absolute bottom-8 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Click to flip
                  </p>
                </div>

                {/* Back */}
                <div 
                  className={cn(
                    "absolute inset-0 backface-hidden bg-[#5A5A40] text-white border rounded-[32px] shadow-sm flex flex-col items-center justify-center p-8 sm:p-12 text-center",
                    "border-[#5A5A40]"
                  )}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 absolute top-8">Answer</p>
                  <h3 className="text-xl sm:text-2xl font-serif leading-relaxed">
                    {flashcards[currentIndex].back}
                  </h3>
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8 gap-4">
              <button onClick={prevCard} disabled={currentIndex === 0} className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-[#E4E3E0] text-[#5A5A40] disabled:opacity-50 hover:bg-[#F5F5F0] transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleStatusUpdate('review')} 
                  className="px-6 py-3 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-bold flex items-center gap-2 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" /> Need Review
                </button>
                <button 
                  onClick={() => handleStatusUpdate('known')} 
                  className="px-6 py-3 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Got It
                </button>
              </div>

              <button onClick={nextCard} disabled={currentIndex === flashcards.length - 1} className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-[#E4E3E0] text-[#5A5A40] disabled:opacity-50 hover:bg-[#F5F5F0] transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
