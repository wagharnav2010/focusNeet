import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { generateQuizQuestions } from '../lib/gemini';
import { SubjectKey } from '../data/syllabus';
import type { Question, QuizResult } from '../types';
import { cn } from '../lib/utils';

export function QuizView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectKey = searchParams.get('subject') as SubjectKey;
  const topic = searchParams.get('topic');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!subjectKey || !topic) {
      navigate('/');
      return;
    }

    async function loadQuestions() {
      try {
        setLoading(true);
        setError(null);
        const q = await generateQuizQuestions(subjectKey, topic!, 5);
        if (q && q.length > 0) {
          setQuestions(q);
        } else {
          setError("Failed to generate questions. Please make sure your Gemini API key is correct and valid.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while communicating with the AI.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [subjectKey, topic, navigate]);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const finalAnswers = questions.map((q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      return {
        question: q,
        selectedOption: selected,
        isCorrect
      };
    });

    const result: QuizResult = {
      subject: subjectKey,
      topic: topic!,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      answers: finalAnswers
    };

    // Store in location state for analysis page
    navigate('/analysis', { state: { result } });
  };

    if (loading) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-transparent">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="mb-8"
          >
            <div className="w-16 h-16 border-4 border-[#5A5A40]/20 border-t-[#5A5A40] rounded-full" />
          </motion.div>
          <h2 className="text-2xl font-serif font-bold text-[#5A5A40] mb-2">Generating Assessment</h2>
          <p className="text-[#4A4A3A]/70 max-w-sm text-center">
            Our AI is constructing tricky, NCERT-grounded questions specifically for {topic}.
          </p>
        </div>
      );
    }

  if (error || questions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md text-center border border-red-100">
          <p className="font-semibold mb-2">Assessment Generation Failed</p>
          <p className="text-sm opacity-90">{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 min-h-screen flex flex-col">
      {/* Header & Progress */}
      <div className="mb-8 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]/60 mb-1">{subjectKey}</p>
            <h1 className="text-xl font-serif font-bold text-[#5A5A40]">{topic}</h1>
          </div>
          <div className="text-[#4A4A3A]/70 font-mono text-sm bg-white px-3 py-1 rounded-lg border border-[#E4E3E0]">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
        <div className="h-2 w-full bg-[#E4E3E0] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#5A5A40] rounded-full"
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[32px] p-6 sm:p-10 shadow-sm border border-[#E4E3E0]"
          >
            <h2 className="text-2xl font-serif text-[#5A5A40] mb-8 leading-relaxed">
              {currentQ.questionText}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border transition-all flex items-center group",
                      isSelected 
                        ? "border-[#5A5A40] bg-[#F5F5F0]" 
                        : "border-[#E4E3E0] bg-[#F5F5F0]/50 hover:border-[#5A5A40]/40 hover:bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm mr-4 transition-colors",
                      isSelected 
                        ? "bg-[#5A5A40] border-[#5A5A40] text-white" 
                        : "border-[#E4E3E0] text-[#4A4A3A]/50 group-hover:border-[#5A5A40]/40 group-hover:text-[#5A5A40]"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={cn("text-base", isSelected ? "text-[#5A5A40] font-bold" : "text-[#4A4A3A]")}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-[#5A5A40] hover:bg-white border border-transparent hover:border-[#E4E3E0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={answers[currentIndex] === undefined}
            className="flex items-center space-x-2 px-8 py-3 rounded-full font-bold text-white bg-[#5A5A40] hover:bg-[#4A4A3A] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Submit Test</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
            disabled={answers[currentIndex] === undefined}
            className="flex items-center space-x-2 px-8 py-3 rounded-full font-bold text-white bg-[#5A5A40] hover:bg-[#4A4A3A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next Question</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
