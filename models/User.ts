// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  avatar?: string;
  studyInterests: string[];
  streak: number;
  lastActive: Date;
  totalXP: number;
  createdAt: Date;
  bookmarks: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatar: { type: String, default: '' },
  studyInterests: [{ type: String }],
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  totalXP: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
