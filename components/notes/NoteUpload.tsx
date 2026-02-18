// components/notes/NoteUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, CheckCircle2, AlertCircle, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/toast';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = [
  'Mathematics', 'Science', 'History', 'English', 'Programming',
  'Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology',
];

export default function NoteUpload() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const isValidType = selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain';
      const isValidSize = selectedFile.size <= 15 * 1024 * 1024; // 15MB

      if (!isValidType) {
        setError('Only PDF or Text files are supported');
        setFile(null);
        return;
      }
      if (!isValidSize) {
        setError('Maximum file size is 15MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!title || !subject) {
      setError('Missing title or subject');
      return;
    }
    if (uploadMethod === 'file' && !file) {
      setError('Please select a file to upload');
      return;
    }
    if (uploadMethod === 'text' && !textContent.trim()) {
      setError('Content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      if (uploadMethod === 'file' && file) {
        formData.append('file', file);
      } else {
        formData.append('content', textContent);
      }

      if (!user) throw new Error('Authentication required');
      const token = await user.getIdToken();
      const response = await fetch('/api/notes/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/notes/${data.noteId}`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'System error during upload');
      showError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8 px-4"
    >
      <Card className="card-premium border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-border/50 py-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FileUp className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Create New Note</CardTitle>
          <CardDescription>Upload your documents or paste content to start learning</CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Document Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quantum Physics 101"
                  className="h-12 rounded-xl focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-12 rounded-xl focus:ring-primary/20">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl p-1">
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Upload Method</Label>
              <div className="flex p-1 bg-secondary/50 rounded-2xl gap-1">
                <Button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={cn(
                    "flex-1 h-11 rounded-xl shadow-none transition-all duration-300",
                    uploadMethod === 'file' ? "bg-background text-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-background/50 hover:text-foreground"
                  )}
                >
                  <Upload className="w-4 h-4 mr-2" /> File Upload
                </Button>
                <Button
                  type="button"
                  onClick={() => setUploadMethod('text')}
                  className={cn(
                    "flex-1 h-11 rounded-xl shadow-none transition-all duration-300",
                    uploadMethod === 'text' ? "bg-background text-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-background/50 hover:text-foreground"
                  )}
                >
                  <FileText className="w-4 h-4 mr-2" /> Text Input
                </Button>
              </div>
            </div>

            <div className="min-h-[200px]">
              {uploadMethod === 'file' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                    file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.txt" />

                  {file ? (
                    <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in">
                      <div className="p-4 rounded-full bg-primary/20 text-primary">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <span className="font-bold text-center break-all max-w-[250px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</span>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-destructive hover:bg-destructive/10">
                        <X className="w-3 h-3 mr-1" /> Replace
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-secondary text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">Click to browse or drag & drop</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports PDF & TXT up to 15MB</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your study material here..."
                    className="min-h-[250px] rounded-2xl resize-none p-6 focus:ring-primary/20"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Materials...
                </span>
              ) : (
                "Save & Analyze Note"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-8 pt-0 flex flex-col gap-4 px-8">
          <div className="w-full h-px bg-border/50" />
          <div className="flex items-center justify-between w-full text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">
            <span>Enterprise Encryption</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI System Online</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}