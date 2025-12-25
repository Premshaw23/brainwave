
// models/Post.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  contentType: 'quiz' | 'flashcard' | 'note';
  contentId: mongoose.Types.ObjectId;
  caption: string;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contentType: { type: String, enum: ['quiz', 'flashcard', 'note'], required: true },
  contentId: { type: Schema.Types.ObjectId, required: true },
  caption: { type: String, default: '' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);