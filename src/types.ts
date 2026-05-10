export interface Question {
  id: string;
  subject: string;
  topic: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResult {
  id?: string;
  timestamp?: number;
  subject: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    question: Question;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export interface StudyTask {
  task: string;
  type: 'Read' | 'Practice' | 'Watch';
  details: string;
  durationEstimate: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: 'new' | 'known' | 'review';
  topic: string;
}

export interface WeakSpotAnalysis {
  overallAssessment: string;
  weakTopics: string[];
  strongTopics: string[];
  actionPlan: StudyTask[];
  recommendedResources: string[];
}
