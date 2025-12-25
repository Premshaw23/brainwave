
// lib/auth-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from './firebase-admin';
import connectDB from './mongodb';
import User from '@/models/User';

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return { error: 'No token provided', status: 401 };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    
    await connectDB();
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    return { user, userId: user._id.toString(), firebaseUid: decodedToken.uid };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { error: 'Invalid token', status: 401 };
  }
}

export function createAuthResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

// ============================================

// types/index.ts
export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  avatar?: string;
  studyInterests: string[];
  streak: number;
  lastActive: Date;
  totalXP: number;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  fileUrl?: string;
  tags: string[];
  createdAt: Date;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  _id: string;
  noteId: string;
  userId: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  isPublic: boolean;
  createdAt: Date;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  timeSpent: number;
  completedAt: Date;
}

export interface StudyGroup {
  _id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  inviteCode: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface Message {
  _id: string;
  groupId?: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: 'text' | 'quiz_share' | 'flashcard_share';
  metadata?: any;
  createdAt: Date;
}