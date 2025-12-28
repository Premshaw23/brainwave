// app/(dashboard)/notes/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Sparkles, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import Link from 'next/link';

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { id: paramsid } = React.use(params);


  useEffect(() => {
    const fetchNote = async (userObj: any) => {
      try {
        if (!userObj) return;
        const token = await userObj.getIdToken();
        const response = await fetch(`/api/notes/${paramsid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.success) {
          setNote(data.note);
        }
      } catch (err) {
        console.error('Failed to fetch note:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote(user);
  }, [paramsid, user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          <Link href={`/notes/${paramsid}/generate-quiz`}>
            <Button>
              <Brain className="w-4 h-4 mr-2" />
              Generate Quiz
            </Button>
          </Link>
          <Link href={`/notes/${paramsid}/generate-flashcards`}>
            <Button variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Flashcards
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{note.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {note.content.length} characters
                </span>
              </div>
            </div>
            <Badge className="capitalize">{note.subject}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {note.content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}