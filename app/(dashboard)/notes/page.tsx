
// app/(dashboard)/notes/page.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger ,DialogTitle} from '@/components/ui/dialog';
import NoteUpload from '@/components/notes/NoteUpload';
import NoteList from '@/components/notes/NoteList';

export default function NotesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-linear-to-r from-indigo-50 to-white rounded-xl p-6 shadow-sm mb-2">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight">My Notes</h1>
          <p className="text-gray-600 mt-2 text-lg">Upload and manage your study materials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow">
              <Plus className="w-5 h-5 mr-2" />
              Upload Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-indigo-100">
            {/* Visually hidden DialogTitle for accessibility */}
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
              <DialogTitle>Upload Note</DialogTitle>
            </span>
            <NoteUpload />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        <NoteList />
      </div>
    </div>
  );
}
