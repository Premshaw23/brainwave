
// components/notes/NoteCard.tsx
'use client';

import Link from 'next/link';
import { FileText, Calendar, Tag, Trash2, Brain, Share2 } from 'lucide-react';
import ShareContentModal from '@/components/community/ShareContentModel';
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
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  };

  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200 hover:scale-[1.03] hover:shadow-indigo-200/50 transition-all duration-200">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <Link href={`/notes/${note._id}`}>
              <h3 className="text-2xl font-bold text-gray-900 hover:text-indigo-700 transition-colors tracking-tight mb-2">
                {note.title}
              </h3>
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(note.createdAt)}
              </span>
            </div>
          </div>
          <Badge className={getSubjectColor(note.subject) + ' px-3 py-1 text-base font-semibold rounded-xl shadow-sm'}>
            {note.subject}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 items-center">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-1 rounded-lg bg-indigo-50 border-indigo-200 text-indigo-700">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Link href={`/notes/${note._id}`}>
              <Button size="sm" variant="outline" className="rounded-lg shadow-sm hover:bg-indigo-100">
                <FileText className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/notes/${note._id}/generate-quiz`}>
              <Button size="sm" className="rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700">
                <Brain className="w-4 h-4 mr-1" />
                Quiz
              </Button>
            </Link>
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                className="rounded-lg shadow-sm"
                onClick={() => onDelete(note._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <ShareContentModal
              contentType="note"
              contentId={note._id}
              contentTitle={note.title}
              trigger={
                <Button size="sm" variant="outline" className="rounded-lg shadow-sm hover:bg-indigo-100">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}