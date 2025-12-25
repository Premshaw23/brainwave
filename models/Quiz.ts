
// models/Quiz.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface IQuiz extends Document {
  noteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: IQuestion[];
  isPublic: boolean;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const QuizSchema = new Schema<IQuiz>({
  noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  questions: [QuestionSchema],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

QuizSchema.index({ userId: 1, createdAt: -1 });
QuizSchema.index({ subject: 1, difficulty: 1 });

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
