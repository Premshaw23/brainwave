
// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content returned from OpenAI');

    const parsed = JSON.parse(content);
    return parsed.questions;
  } catch (error) {
    console.error('OpenAI Quiz Generation Error:', error);
    throw new Error('Failed to generate quiz');
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
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content returned from OpenAI');

    const parsed = JSON.parse(content);
    return parsed.cards;
  } catch (error) {
    console.error('OpenAI Flashcard Generation Error:', error);
    throw new Error('Failed to generate flashcards');
  }
}

export default openai;
