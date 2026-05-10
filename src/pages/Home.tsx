import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NEET_SYLLABUS, SubjectKey } from '../data/syllabus';
import { Microscope, Atom, BookOpen, Dna, BrainCircuit, Play } from 'lucide-react';
import React from 'react';

export function Home() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(null);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [numQuestions, setNumQuestions] = useState<number>(5);

  const subjectIcons: Record<SubjectKey, React.ElementType> = {
    physics: Atom,
    chemistry: Microscope,
    botany: BookOpen,
    zoology: Dna,
  };

  const handleStartQuiz = (topic: string) => {
    if (!selectedSubject) return;
    navigate(`/quiz?subject=${selectedSubject}&topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&q=${numQuestions}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-serif text-[#5A5A40] mb-4">
          Identify your weak spots.
        </h1>
        <p className="text-lg text-[#4A4A3A]/70 max-w-2xl">
          Select a subject and topic to take a targeted NEET quiz. Our AI, calibrated to NCERT standards, will analyze your mistakes and guide you exactly where to revise.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Subject Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[10px] font-bold text-[#4A4A3A]/50 uppercase tracking-widest mb-4">Select Subject</h2>
          {(Object.keys(NEET_SYLLABUS) as SubjectKey[]).map((key) => {
            const Icon = subjectIcons[key];
            const isSelected = selectedSubject === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedSubject(key)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  isSelected 
                    ? 'border-[#5A5A40] bg-[#E4E3E0]/40 shadow-sm ring-1 ring-[#5A5A40]' 
                    : 'border-[#E4E3E0] bg-white hover:border-[#5A5A40]/30 hover:bg-[#F5F5F0]'
                }`}
              >
                <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#5A5A40] text-white' : 'bg-[#E4E3E0] text-[#5A5A40]'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isSelected ? 'text-[#5A5A40]' : 'text-[#4A4A3A]'}`}>
                    {NEET_SYLLABUS[key].name}
                  </h3>
                  <p className="text-xs opacity-70">{NEET_SYLLABUS[key].topics.length} Chapters</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Topics List */}
        <div className="lg:col-span-2">
          {selectedSubject ? (
            <motion.div 
              key={selectedSubject}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-[#E4E3E0] rounded-[32px] p-8 shadow-sm flex flex-col h-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-[#E4E3E0] pb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <BrainCircuit className="w-6 h-6 text-[#5A5A40]" />
                  <h2 className="text-xl font-serif font-bold text-[#5A5A40]">
                    {NEET_SYLLABUS[selectedSubject].name} Chapters
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center bg-[#F5F5F0] p-1 rounded-lg">
                    {(["Easy", "Medium", "Hard"] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${difficulty === level ? "bg-white text-[#5A5A40] shadow-sm" : "text-[#4A4A3A]/50 hover:text-[#5A5A40]"}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center bg-[#F5F5F0] p-1 rounded-lg">
                    {[5, 10, 20, 30, 50].map(num => (
                      <button
                        key={num}
                        onClick={() => setNumQuestions(num)}
                        className={`flex-1 px-2 py-1.5 text-xs font-bold rounded-md transition-all ${numQuestions === num ? "bg-white text-[#5A5A40] shadow-sm" : "text-[#4A4A3A]/50 hover:text-[#5A5A40]"}`}
                      >
                        {num} Qs
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {NEET_SYLLABUS[selectedSubject].topics.map((topic) => (
                  <div 
                    key={topic} 
                    className="group border border-[#E4E3E0] bg-[#F5F5F0]/50 hover:bg-white hover:border-[#5A5A40]/30 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <h4 className="font-semibold text-[#4A4A3A] text-sm mb-4 leading-relaxed group-hover:text-[#5A5A40]">
                      {topic}
                    </h4>
                    <button
                      onClick={() => handleStartQuiz(topic)}
                      className="inline-flex items-center justify-center w-full bg-[#5A5A40] hover:bg-[#4A4A3A] text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors mt-auto"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Take Assessment
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-[#E4E3E0] rounded-[32px] p-12 text-center bg-[#F5F5F0]/50">
              <div>
                <Microscope className="w-12 h-12 text-[#5A5A40]/30 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#5A5A40]">No subject selected</h3>
                <p className="text-[#4A4A3A]/50 text-sm mt-1">Select a subject from the left to view chapters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
