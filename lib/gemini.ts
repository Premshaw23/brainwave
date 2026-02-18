// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface GenerateQuizParams {
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  subject: string;
}

/**
 * Optimized generation with faster models and robust fallbacks.
 * Cycles through models to find one that is available and responsive.
 */
async function generateWithFallback(prompt: string) {
  // We prioritize Flash 1.5-8b for the absolute fastest (lite) free-tier experience.
  const models = [
    "gemini-2.5-flash-lite", 
    "gemini-2.0-flash-lite-preview-001",
    "gemini-pro"
  ];
  
  const lastError: string[] = [];
  
  for (const modelName of models) {
    try {
      console.log(`[Gemini Engine] Engaging model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      // Wrap generation in a promise to handle timeout correctly
      const generatePromise = model.generateContent(prompt);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout with ${modelName}`)), 20000)
      );

      const result = await Promise.race([generatePromise, timeoutPromise]) as any;
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        console.log(`[Gemini Engine] Synthesis successful via ${modelName}`);
        return text;
      }
    } catch (error: any) {
      const errorMsg = error.message || "Unknown error";
      console.warn(`[Gemini Engine] ${modelName} state:`, errorMsg);
      lastError.push(`${modelName}: ${errorMsg}`);
      
      // If it's a 404 or 400 (unsupported model), continue to next
      if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('400')) {
        continue;
      }
      
      // For rate limits (429), we might want to wait or try a different model tier
      if (errorMsg.includes('429')) {
        console.warn(`[Gemini Engine] Rate limit hit on ${modelName}, pivoting...`);
        continue;
      }
    }
  }
  
  console.error("[Gemini Engine] Critical Failure. All models exhausted.", lastError);
  throw new Error("AI synthesis failed. This is likely due to API model availability in your region or an invalid API key. Please try again in 5 minutes.");
}

export async function generateQuiz({
  content,
  difficulty,
  numQuestions,
  subject,
}: GenerateQuizParams) {
  const prompt = `You are an expert educator. Create a ${difficulty} difficulty multiple-choice quiz about "${subject}".
  
  Context Content:
  ${content.substring(0, 30000)} // Increased limit for better context

  Task: Generate exactly ${numQuestions} questions.
  
  Output Schema (JSON):
  {
    "questions": [
      {
        "question": "Clear question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0, // Index 0-3
        "explanation": "Brief context-rich explanation"
      }
    ]
  }
  `;

  try {
    const text = await generateWithFallback(prompt);
    
    // Extract JSON securely
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    const match = jsonStr.match(/\{[\s\S]*\}/);
    const finalJson = match ? match[0] : jsonStr;

    const parsed = JSON.parse(finalJson);
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid quiz format');
    }
    return parsed.questions;
  } catch (error) {
    console.error("Gemini Quiz Generation Error:", error);
    throw error;
  }
}

interface GenerateFlashcardsParams {
  content: string;
  numCards: number;
  subject: string;
}

export async function generateFlashcards({
  content,
  numCards,
  subject,
}: GenerateFlashcardsParams) {
  const prompt = `You are an expert educator. Create ${numCards} high-quality flashcards about "${subject}".
  
  Context Content:
  ${content.substring(0, 30000)}

  Task: Generate exactly ${numCards} flashcards.
  
  Requirements:
  - Front: Clear term or focused question
  - Back: Detailed yet concise answer
  - Focus on key concepts, definitions, and relationships
  
  Output Schema (JSON):
  {
    "cards": [
      {
        "front": "Term or Question",
        "back": "Definition or Answer"
      }
    ]
  }
  `;

  try {
    const text = await generateWithFallback(prompt);
    
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    const match = jsonStr.match(/\{[\s\S]*\}/);
    const finalJson = match ? match[0] : jsonStr;

    const parsed = JSON.parse(finalJson);
    
    if (!parsed.cards || !Array.isArray(parsed.cards)) {
      throw new Error('Invalid flashcard format');
    }
    return parsed.cards;
  } catch (error) {
    console.error("Gemini Flashcard Generation Error:", error);
    throw error;
  }
}

export default genAI;

