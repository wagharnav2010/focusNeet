import { GoogleGenAI, Type } from "@google/genai";
import type { Question, WeakSpotAnalysis, QuizResult } from "../types";
import { NEET_SYLLABUS, SubjectKey } from "../data/syllabus";

let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function generateQuizQuestions(
  subjectKey: SubjectKey,
  topic: string,
  numQuestions: number = 5
): Promise<Question[]> {
  const ai = getAiClient();
  const subjectName = NEET_SYLLABUS[subjectKey].name;

  const prompt = `You are an expert NEET (National Eligibility cum Entrance Test) exam generator.
Generate ${numQuestions} highly accurate, tricky, and conceptual multiple-choice questions for the subject "${subjectName}" specifically from the topic "${topic}".
The questions must be strictly grounded in the Indian NCERT class 11 and class 12 syllabus, which is the official syllabus for NEET.
Format your output as a JSON array.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING, description: "The MCQ question text" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 options for the MCQ",
            },
            correctOptionIndex: {
              type: Type.INTEGER,
              description: "The 0-based index of the correct option (0, 1, 2, or 3)",
            },
            explanation: {
              type: Type.STRING,
              description: "A detailed explanation of why the answer is correct according to NCERT",
            },
          },
          required: ["questionText", "options", "correctOptionIndex", "explanation"],
        },
      },
    },
  });

  const jsonStr = response.text?.trim() || "[]";
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.map((item: any, idx: number) => ({
      id: `${topic.replace(/\s+/g, '-')}-${Date.now()}-${idx}`,
      subject: subjectName,
      topic,
      ...item,
    }));
  } catch (err) {
    console.error("Failed to parse questions", err);
    return [];
  }
}

export async function analyzeQuizResult(
  result: QuizResult
): Promise<WeakSpotAnalysis> {
  const ai = getAiClient();
  
  const studentPerformance = result.answers.map((a, i) => ({
    q: a.question.questionText,
    studentAnsweredCorrectly: a.isCorrect,
    concept: a.question.explanation
  }));

  const prompt = `You are an expert NEET academic counselor.
Analyze the following quiz performance in the topic "${result.topic}" (Subject: ${result.subject}).
The student scored ${result.correctAnswers} out of ${result.totalQuestions}.
Here are the question-by-question details:
${JSON.stringify(studentPerformance, null, 2)}

Identify the student's weak spots within this topic based on the questions they got wrong.
Provide a strict, actionable study plan referencing NCERT concepts or standard formulas they need to revise.
Format the output as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallAssessment: { type: Type.STRING, description: "A summary assessing their performance." },
          weakTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific sub-topics or concepts they got wrong.",
          },
          strongTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concepts they answered correctly.",
          },
          actionPlan: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step revision tasks (e.g. 'Read NCERT Class 11 Chapter 4 page XX').",
          },
          recommendedResources: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Names of books, NCERT chapters, or typical NEET resources to help fix their weak spots.",
          },
        },
        required: ["overallAssessment", "weakTopics", "strongTopics", "actionPlan", "recommendedResources"],
      },
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  try {
    return JSON.parse(jsonStr) as WeakSpotAnalysis;
  } catch (err) {
    console.error("Failed to parse analysis", err);
    return {
      overallAssessment: "Could not generate assessment.",
      weakTopics: [],
      strongTopics: [],
      actionPlan: ["Please try again."],
      recommendedResources: []
    };
  }
}
