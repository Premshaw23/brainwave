
// components/community/CommunityFilters.tsx
'use client';

import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface CommunityFiltersProps {
  subject: string;
  type: string;
  onSubjectChange: (subject: string) => void;
  onTypeChange: (type: string) => void;
}

export default function CommunityFilters({ subject, type, onSubjectChange, onTypeChange }: CommunityFiltersProps) {
  return (
    <div className="flex gap-4 items-center">
      <Filter className="w-5 h-5 text-indigo-500" />
      <Select value={subject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-56 h-12 rounded-xl border border-indigo-200 bg-white shadow-sm text-base font-semibold focus:ring-2 focus:ring-indigo-300">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg bg-white border border-indigo-100">
          <SelectItem value="all" className="text-indigo-700 font-semibold">All Subjects</SelectItem>
          <SelectItem value="mathematics">Mathematics</SelectItem>
          <SelectItem value="science">Science</SelectItem>
          <SelectItem value="history">History</SelectItem>
          <SelectItem value="programming">Programming</SelectItem>
          <SelectItem value="physics">Physics</SelectItem>
          <SelectItem value="chemistry">Chemistry</SelectItem>
          <SelectItem value="biology">Biology</SelectItem>
        </SelectContent>
      </Select>
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-56 h-12 rounded-xl border border-indigo-200 bg-white shadow-sm text-base font-semibold focus:ring-2 focus:ring-indigo-300">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg bg-white border border-indigo-100">
          <SelectItem value="all" className="text-indigo-700 font-semibold">All Types</SelectItem>
          <SelectItem value="quiz">Quizzes</SelectItem>
          <SelectItem value="flashcard">Flashcards</SelectItem>
          <SelectItem value="note">Notes</SelectItem>
          <SelectItem value="summary">Summaries</SelectItem>
          <SelectItem value="screenshot">Screenshots</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}