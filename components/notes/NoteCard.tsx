
// components/notes/NoteCard.tsx
'use client';

import Link from 'next/link';
import { FileText, Calendar, Tag, Trash2, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSubjectColor } from '@/lib/utils';

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    subject: string;
    createdAt: string;
    tags: string[];
  };
  onDelete?: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/notes/${note._id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                {note.title}
              </h3>
            </Link>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(note.createdAt)}
              </span>
            </div>
          </div>
          <Badge className={getSubjectColor(note.subject)}>
            {note.subject}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Link href={`/notes/${note._id}`}>
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/notes/${note._id}/generate-quiz`}>
              <Button size="sm">
                <Brain className="w-4 h-4 mr-1" />
                Quiz
              </Button>
            </Link>
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(note._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}