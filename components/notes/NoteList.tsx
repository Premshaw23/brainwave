
// components/notes/NoteList.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NoteCard from './NoteCard';
import AppLoader from '@/components/ui/AppLoader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/toast';

export default function NoteList() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch('/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notes');
      showError(err.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== id));
      }
    } catch (err) {
      showError('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AppLoader message="Loading notes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-600 font-medium">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-8 text-center">
          <p className="text-indigo-700 text-lg font-semibold">No notes yet. Upload your first note to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}