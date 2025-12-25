
// models/QuizAttempt.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  timeSpent: number; // in seconds
  completedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionIndex: { type: Number, required: true },
  selectedAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [AnswerSchema],
  score: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

QuizAttemptSchema.index({ userId: 1, completedAt: -1 });
QuizAttemptSchema.index({ quizId: 1, userId: 1 });

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
