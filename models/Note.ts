// models/Note.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  subject: string;
  fileUrl?: string;
  tags: string[];
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ subject: 1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

