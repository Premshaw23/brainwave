
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
      <Filter className="w-5 h-5 text-gray-500" />
      <Select value={subject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
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
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
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