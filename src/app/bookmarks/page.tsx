"use client";

import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { Card } from "@/components/shared/Card";

export default function BookmarksPage() {
  const bookmarks = useStudyStore((s) => s.bookmarkedIds);
  const toggleBookmark = useStudyStore((s) => s.toggleBookmark);
  const entries = Object.entries(bookmarks);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        <p className="mt-1 text-sm text-muted">Quick access to tasks, units, and resources you&apos;ve saved.</p>
      </div>

      {entries.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-12 text-center">
          <Bookmark className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">
            Nothing bookmarked yet. Use the bookmark icon on any task, unit, or resource.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map(([id, b]) => (
            <Card key={id} className="flex items-center justify-between gap-3">
              <Link href={b.href} className="min-w-0 flex-1 truncate text-sm hover:text-accent">
                {b.label}
              </Link>
              <button
                onClick={() => toggleBookmark(id, b.label, b.href)}
                className="rounded-lg p-1.5 text-muted hover:bg-surface-2"
                aria-label="Remove bookmark"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
