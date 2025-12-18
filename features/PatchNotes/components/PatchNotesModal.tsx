'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import PostWrapper from '@/shared/components/layout/PostWrapper';
import { patchNotesData } from '../patchNotesData';

interface PatchNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PatchNotesModal({
  open,
  onOpenChange
}: PatchNotesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl w-[95vw] sm:w-[90vw] max-h-[85vh] sm:max-h-[80vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='px-6 pt-6 pb-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--background-color)] z-10'>
          <DialogTitle className='text-2xl'>Patch Notes</DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto px-6 py-4 flex-1'>
          <div className='space-y-8'>
            {patchNotesData.map((patch, index) => (
              <div key={index}>
                <PostWrapper
                  textContent={patch.changes
                    .map(change => `- ${change}`)
                    .join('\n')}
                  tag={`v${patch.version}`}
                  date={new Date(patch.date).toISOString()}
                />
                {index < patchNotesData.length - 1 && (
                  <hr className='mt-8 border-[var(--border-color)] opacity-50' />
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
