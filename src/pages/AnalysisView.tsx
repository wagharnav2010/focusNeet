import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analyzeQuizResult } from '../lib/gemini';
import type { QuizResult, WeakSpotAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { AlertCircle, CheckCircle2, ChevronRight, BookOpen, Target, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function AnalysisView() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as QuizResult;

  const [analysis, setAnalysis] = useState<WeakSpotAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!result) {
      navigate('/');
      return;
    }

    async function fetchAnalysis() {
      try {
        const data = await analyzeQuizResult(result);
        setAnalysis(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [result, navigate]);

  if (!result) return null;

    if (loading) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-transparent">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-24 border-[6px] border-dashed border-[#5A5A40]/20 border-t-[#5A5A40] rounded-full relative z-10"
            />
            <Target className="w-8 h-8 text-[#5A5A40]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-50" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#5A5A40] mt-8 mb-2">Analyzing Performance</h2>
          <p className="text-[#4A4A3A]/70 max-w-sm text-center">
            Processing your answers through our NEET NCERT knowledge base to highlight the sub-topics you need to revise.
          </p>
        </div>
      );
    }

  const scorePercentage = (result.correctAnswers / result.totalQuestions) * 100;
  const pieData = [
    { name: 'Correct', value: result.correctAnswers },
    { name: 'Incorrect', value: result.totalQuestions - result.correctAnswers },
  ];
  const COLORS = ['#5A5A40', '#E4E3E0'];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#5A5A40] tracking-tight">Your Action Plan</h1>
          <p className="text-[#4A4A3A]/70 mt-1">{result.subject} • {result.topic}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-white border border-[#E4E3E0] text-[#5A5A40] hover:bg-[#F5F5F0] px-4 py-2 rounded-2xl text-sm font-semibold transition-colors shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Performance details */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 border border-[#E4E3E0] shadow-sm text-center"
          >
            <h3 className="font-bold text-[#4A4A3A]/50 uppercase tracking-widest text-[10px] mb-6">Assessment Score</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    cornerRadius={10}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-bold text-[#5A5A40]">{scorePercentage.toFixed(0)}%</span>
                <span className="text-xs text-[#4A4A3A]/50 font-bold uppercase tracking-wider">{result.correctAnswers} of {result.totalQuestions}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#5A5A40] rounded-[32px] p-8 text-white shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E4E3E0] mb-3">Overall AI Assessment</h3>
              <p className="text-lg leading-relaxed font-serif">
                "{analysis?.overallAssessment}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Analysis & Action Plan */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
             className="grid sm:grid-cols-2 gap-6"
          >
            {/* Weak Spots */}
            <div className="bg-red-50/50 rounded-[32px] p-6 border border-red-100">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Critical Weak Spots</h3>
              </div>
              <ul className="space-y-3">
                {analysis?.weakTopics.map((topic, i) => (
                  <li key={i} className="flex items-start text-sm text-red-900/80">
                    <span className="mr-2 mt-0.5">•</span>
                    <span className="leading-snug">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strong Spots */}
            <div className="bg-[#E4E3E0]/40 rounded-[32px] p-6 border border-[#5A5A40]/10">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-bold text-[#5A5A40]">Retained Concepts</h3>
              </div>
              <ul className="space-y-3">
                {analysis?.strongTopics.map((topic, i) => (
                  <li key={i} className="flex items-start text-sm text-[#4A4A3A]">
                    <span className="mr-2 mt-0.5">•</span>
                    <span className="leading-snug">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Action Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] p-8 border border-[#E4E3E0] shadow-sm"
          >
            <h3 className="font-serif font-bold text-[#5A5A40] text-xl mb-6">Targeted Action Plan</h3>
            <div className="space-y-4">
              {analysis?.actionPlan.map((step, i) => (
                <div key={i} className="flex items-start bg-[#F5F5F0]/50 rounded-2xl p-4 border border-[#E4E3E0]/50">
                  <div className="bg-white border border-[#E4E3E0] text-[#5A5A40] font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4 text-sm mt-0.5 shadow-sm">
                    {i + 1}
                  </div>
                  <p className="text-[#4A4A3A] font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Resources */}
          {analysis?.recommendedResources && analysis.recommendedResources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-[#F5F5F0] rounded-[32px] p-6 border border-[#E4E3E0]"
            >
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-bold text-[#5A5A40]">Recommended Resources</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendedResources.map((res, i) => (
                  <span key={i} className="bg-white border border-[#E4E3E0] text-[#4A4A3A] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                    {res}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question Review Accordion (Simple) */}
          <motion.div
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
             className="bg-white rounded-[32px] overflow-hidden border border-[#E4E3E0] shadow-sm"
          >
            <div className="p-6 border-b border-[#E4E3E0] bg-[#F5F5F0]/50">
               <h3 className="font-bold text-[#5A5A40]">Question Review</h3>
            </div>
            <div className="divide-y divide-[#E4E3E0] max-h-[400px] overflow-y-auto">
              {result.answers.map((ans, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-start mb-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 mt-0.5",
                      ans.isCorrect ? "bg-[#E4E3E0]/50 text-[#5A5A40]" : "bg-red-100 text-red-700"
                    )}>
                      {ans.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <p className="text-[#4A4A3A] font-medium text-sm leading-relaxed">{ans.question.questionText}</p>
                  </div>
                  
                  <div className="ml-9 space-y-2 mb-4">
                    {ans.question.options.map((opt, optIdx) => {
                      const isSelected = ans.selectedOption === optIdx;
                      const isCorrectOpt = ans.question.correctOptionIndex === optIdx;
                      
                      let bgClass = "bg-[#F5F5F0] border-[#E4E3E0] text-[#4A4A3A]/70";
                      if (isCorrectOpt) {
                        bgClass = "bg-[#E4E3E0]/40 border-[#E4E3E0] text-[#5A5A40] font-bold";
                      } else if (isSelected && !isCorrectOpt) {
                        bgClass = "bg-red-50 border-red-200 text-red-800 font-medium";
                      }

                      return (
                        <div key={optIdx} className={cn("px-4 py-2 rounded-xl text-xs border", bgClass)}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  <div className="ml-9 bg-[#F5F5F0] p-4 rounded-xl text-xs text-[#5A5A40] leading-relaxed border border-[#E4E3E0] font-serif">
                    <span className="font-bold block mb-1">NCERT Explanation:</span>
                    {ans.question.explanation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
