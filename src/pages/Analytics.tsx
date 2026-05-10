import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Target, Brain, Award } from 'lucide-react';
import type { QuizResult } from '../types';

export function Analytics() {
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('focusneet_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white border border-[#E4E3E0] rounded-[32px] p-12 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-[#F5F5F0] rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-[#5A5A40]/50" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#5A5A40] mb-2">No Data Yet</h2>
          <p className="text-[#4A4A3A]/70 text-sm">
            Take a few quizzes to see your overall performance and analytics here.
          </p>
        </div>
      </div>
    );
  }

  const totalQuizzes = history.length;
  const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const totalCorrect = history.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Trend Data for Line Chart
  const trendData = history.map((h, i) => {
    const d = new Date(h.timestamp || Date.now());
    return {
      name: `Q${i + 1}`,
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      score: Math.round((h.correctAnswers / h.totalQuestions) * 100),
      topic: h.topic
    };
  });

  // Subject Performance
  const subjectMap = history.reduce((acc, curr) => {
    if (!acc[curr.subject]) {
      acc[curr.subject] = { correct: 0, total: 0 };
    }
    acc[curr.subject].correct += curr.correctAnswers;
    acc[curr.subject].total += curr.totalQuestions;
    return acc;
  }, {} as Record<string, { correct: number, total: number }>);

  const subjectData = Object.keys(subjectMap).map(sub => ({
    subject: sub,
    score: Math.round((subjectMap[sub].correct / subjectMap[sub].total) * 100)
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-screen flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#5A5A40]">Performance Analytics</h1>
        <p className="text-[#4A4A3A]/70 mt-1 text-sm">Track your progress and identify macroscopic weak spots.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-[#E4E3E0] shadow-sm flex flex-col items-center justify-center text-center">
          <Target className="w-6 h-6 text-[#5A5A40] mb-3" />
          <p className="text-3xl font-serif font-bold text-[#5A5A40]">{overallAccuracy.toFixed(1)}%</p>
          <p className="text-[10px] uppercase tracking-widest text-[#4A4A3A]/50 font-bold mt-1">Average Accuracy</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-[#E4E3E0] shadow-sm flex flex-col items-center justify-center text-center">
          <Activity className="w-6 h-6 text-[#5A5A40] mb-3" />
          <p className="text-3xl font-serif font-bold text-[#5A5A40]">{totalQuizzes}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#4A4A3A]/50 font-bold mt-1">Quizzes Taken</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-[#E4E3E0] shadow-sm flex flex-col items-center justify-center text-center">
          <Brain className="w-6 h-6 text-[#5A5A40] mb-3" />
          <p className="text-3xl font-serif font-bold text-[#5A5A40]">{totalQuestions}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#4A4A3A]/50 font-bold mt-1">Questions Answered</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-[#E4E3E0] shadow-sm flex flex-col items-center justify-center text-center">
          <Award className="w-6 h-6 text-[#5A5A40] mb-3" />
          <p className="text-3xl font-serif font-bold text-[#5A5A40]">{totalCorrect}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#4A4A3A]/50 font-bold mt-1">Total Correct</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-white rounded-[32px] p-8 border border-[#E4E3E0] shadow-sm">
          <h3 className="font-bold text-[#4A4A3A]/50 uppercase tracking-widest text-[10px] mb-6">Score Trend (Recent Quizzes)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E3E0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#4A4A3A', opacity: 0.7 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#4A4A3A', opacity: 0.7 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ stroke: '#E4E3E0', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E4E3E0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Score']}
                  labelFormatter={(label: string, payload: any) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.topic;
                    }
                    return label;
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#5A5A40" strokeWidth={3} dot={{ r: 4, fill: '#5A5A40', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#4A4A3A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-[32px] p-8 border border-[#E4E3E0] shadow-sm">
          <h3 className="font-bold text-[#4A4A3A]/50 uppercase tracking-widest text-[10px] mb-6">Aggregate by Subject</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E3E0" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#4A4A3A', opacity: 0.7 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#4A4A3A', opacity: 0.7 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#F5F5F0' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E4E3E0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Average Score']}
                />
                <Bar dataKey="score" fill="#5A5A40" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity List */}
      <div className="bg-white rounded-[32px] p-8 border border-[#E4E3E0] shadow-sm">
        <h3 className="font-bold text-[#4A4A3A]/50 uppercase tracking-widest text-[10px] mb-6">Recent Assessments</h3>
        <div className="space-y-4">
          {[...history].reverse().slice(0, 10).map((h, i) => {
            const scorePct = Math.round((h.correctAnswers / h.totalQuestions) * 100);
            const d = new Date(h.timestamp || Date.now());
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F5F5F0]/50 rounded-2xl border border-[#E4E3E0]/50 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A4A3A]/60 bg-[#E4E3E0]/50 px-2 py-0.5 rounded-md">
                      {h.subject}
                    </span>
                    <span className="text-[10px] text-[#4A4A3A]/50">{d.toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-[#5A5A40]">{h.topic}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-serif font-bold text-[#5A5A40]">{scorePct}%</p>
                    <p className="text-[10px] font-bold text-[#4A4A3A]/50 uppercase">{h.correctAnswers}/{h.totalQuestions} Correct</p>
                  </div>
                  <div className="w-12 h-12 rounded-full relative bg-[#E4E3E0] overflow-hidden hidden sm:block">
                    <div className="absolute top-0 left-0 bottom-0 bg-[#5A5A40]" style={{ width: `${scorePct}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
