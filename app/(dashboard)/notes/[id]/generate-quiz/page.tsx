
// app/(dashboard)/notes/[id]/generate-quiz/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import QuizGenerator from '@/components/quiz/QuizGenerator';

import React from 'react';

export default function GenerateQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNote = async (userObj: any) => {
      if (!userObj) return;
      const token = await userObj.getIdToken();
      const response = await fetch(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setNote(data.note);
    };
    fetchNote(user);
  }, [id, user]);

  if (!note) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Note
      </Button>

      <QuizGenerator noteId={id} noteTitle={note.title} />
    </div>
  );
}