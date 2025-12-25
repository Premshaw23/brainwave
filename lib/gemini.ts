import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface GenerateQuizParams {
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  subject: string;
}

export async function generateQuiz({
  content,
  difficulty,
  numQuestions,
  subject,
}: GenerateQuizParams) {
  const prompt = `You are an expert educator creating a ${difficulty} difficulty quiz about ${subject}.

Based on the following content, generate exactly ${numQuestions} multiple-choice questions.

Content:
${content}

Requirements:
- Each question must have 4 options (A, B, C, D)
- Mark the correct answer index (0-3)
- Provide a clear explanation for the correct answer
- Questions should test understanding, not just memory
- Vary question types (recall, application, analysis)

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct..."
    }
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Gemini raw response:", text);
    // Try to extract JSON block if extra text is present
    let jsonText = text;
    const match = text.match(/\{[\s\S]*\}/);
    if (match) jsonText = match[0];
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.questions) throw new Error('No questions in parsed result');
      return parsed.questions;
    } catch (parseErr) {
      console.error("Gemini Quiz JSON Parse Error:", parseErr, "Raw:", text);
      throw new Error("Failed to parse Gemini quiz JSON");
    }
  } catch (error) {
    console.error("Gemini Quiz Generation Error:", error);
    throw new Error("Failed to generate quiz");
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
  const prompt = `You are an expert educator creating flashcards about ${subject}.

Based on the following content, generate exactly ${numCards} flashcards.

Content:
${content}

Requirements:
- Front: Clear, concise question or term
- Back: Comprehensive but focused answer
- Cover key concepts from the material
- Use simple language for better retention

Return ONLY valid JSON in this exact format:
{
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Gemini raw response:", text);
    // Try to extract JSON block if extra text is present
    let jsonText = text;
    const match = text.match(/\{[\s\S]*\}/);
    if (match) jsonText = match[0];
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.cards) throw new Error('No cards in parsed result');
      return parsed.cards;
    } catch (parseErr) {
      console.error("Gemini Flashcard JSON Parse Error:", parseErr, "Raw:", text);
      throw new Error("Failed to parse Gemini flashcard JSON");
    }
  } catch (error) {
    console.error("Gemini Flashcard Generation Error:", error);
    throw new Error("Failed to generate flashcards");
  }
}

export default genAI;
