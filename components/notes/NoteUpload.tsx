// components/notes/NoteUpload.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText } from 'lucide-react';
import AppLoader from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/toast';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = [
  'Mathematics',
  'Science',
  'History',
  'English',
  'Programming',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Psychology',
];

export default function NoteUpload() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or text file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !subject) {
      setError('Title and subject are required');
      setLoading(false);
      return;
    }
    if (uploadMethod === 'file' && !file) {
      setError('Please upload a file');
      setLoading(false);
      return;
    }
    // ...existing code for upload logic (API call, etc.)
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mt-5">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">Upload Note</CardTitle>
        <CardDescription className="text-indigo-700">Share your notes with the community.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('file')}
              className={`flex-1 ${uploadMethod === 'file' ? 'bg-indigo-600 text-white shadow-md' : ''}`}
            >
              <Upload className="mr-2 h-5 w-5" /> File
            </Button>
            <Button
              type="button"
              variant={uploadMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('text')}
              className={`flex-1 ${uploadMethod === 'text' ? 'bg-indigo-600 text-white shadow-md' : ''}`}
            >
              <FileText className="mr-2 h-5 w-5" /> Text
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-medium text-gray-800">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter note title"
              className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-lg font-medium text-gray-800">Subject</Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger id="subject" className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {uploadMethod === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="textContent" className="text-lg font-medium text-gray-800">Content</Label>
              <Textarea
                id="textContent"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                required
                placeholder="Paste or write your note here"
                rows={6}
                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file" className="text-lg font-medium text-gray-800">File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-600 font-medium">{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full bg-indigo-600 text-white text-lg font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-150" disabled={loading}>
            {loading ? <AppLoader size="md" /> : 'Upload Note'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}