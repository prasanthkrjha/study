"use client";

import { useState } from "react";
import { StickyNote, Trash2 } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { Card } from "@/components/shared/Card";

export default function NotesPage() {
  const notes = useStudyStore((s) => s.notes);
  const addNote = useStudyStore((s) => s.addNote);
  const removeNote = useStudyStore((s) => s.removeNote);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
        <p className="mt-1 text-sm text-muted">Personal notes, freeform or attached to a task/unit.</p>
      </div>

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) {
              addNote(draft.trim());
              setDraft("");
            }
          }}
          className="flex gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a quick note…"
            className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            Add
          </button>
        </form>
      </Card>

      {notes.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-12 text-center">
          <StickyNote className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">No notes yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map((note) => (
            <Card key={note.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {note.targetLabel && (
                  <div className="mb-1 text-xs font-medium text-accent">{note.targetLabel}</div>
                )}
                <p className="text-sm">{note.text}</p>
                <div className="mt-1 text-[11px] text-muted">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => removeNote(note.id)}
                className="rounded-lg p-1.5 text-muted hover:bg-surface-2"
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
