
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">Upload and manage your study materials</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Visually hidden DialogTitle for accessibility */}
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
              <DialogTitle>Upload Note</DialogTitle>
            </span>
            <NoteUpload />
          </DialogContent>
        </Dialog>
      </div>

      <NoteList />
    </div>
  );
}
