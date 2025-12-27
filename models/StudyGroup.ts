
// models/StudyGroup.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyGroup extends Document {
  name: string;
  description: string;
  creatorId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  inviteCode: string;
  isPrivate: boolean;
  createdAt: Date;
}

const StudyGroupSchema = new Schema<IStudyGroup>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  inviteCode: { type: String, required: true },
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

StudyGroupSchema.index({ inviteCode: 1 }, { unique: true });
StudyGroupSchema.index({ creatorId: 1 });

export default mongoose.models.StudyGroup || mongoose.model<IStudyGroup>('StudyGroup', StudyGroupSchema);
