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

export interface WeakSpotAnalysis {
  overallAssessment: string;
  weakTopics: string[];
  strongTopics: string[];
  actionPlan: string[];
  recommendedResources: string[];
}
