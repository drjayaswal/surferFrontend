import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/types/app.types";

interface NotesModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  notes: Note[];
}

export function NotesModal({ open, setOpen, notes }: NotesModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Your Notes</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-zinc-500">No notes available.</p>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-100 p-4 shadow-inner m-2"
              >
                <p className="text-sm text-zinc-800 whitespace-pre-line">
                  {note.content}
                </p>
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 text-right">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
