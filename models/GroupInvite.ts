// models/GroupInvite.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupInvite extends Document {
  groupId: mongoose.Types.ObjectId;
  inviterId: mongoose.Types.ObjectId;
  inviteeEmail: string;
  inviteeId?: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const GroupInviteSchema = new Schema<IGroupInvite>({
  groupId: { type: Schema.Types.ObjectId, ref: 'StudyGroup', required: true },
  inviterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  inviteeEmail: { type: String, required: true },
  inviteeId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

GroupInviteSchema.index({ groupId: 1, inviteeEmail: 1 }, { unique: true });

export default mongoose.models.GroupInvite || mongoose.model<IGroupInvite>('GroupInvite', GroupInviteSchema);
