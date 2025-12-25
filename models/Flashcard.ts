
// models/Flashcard.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICard {
  front: string;
  back: string;
  mastered: boolean;
  lastReviewed?: Date;
}

export interface IFlashcard extends Document {
  noteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  cards: ICard[];
  lastReviewed: Date;
  createdAt: Date;
}

const CardSchema = new Schema<ICard>({
  front: { type: String, required: true },
  back: { type: String, required: true },
  mastered: { type: Boolean, default: false },
  lastReviewed: { type: Date }
}, { _id: false });

const FlashcardSchema = new Schema<IFlashcard>({
  noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  cards: [CardSchema],
  lastReviewed: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

FlashcardSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);
