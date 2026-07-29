"use client";

import { Bookmark } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  id,
  label,
  href,
  className,
}: {
  id: string;
  label: string;
  href: string;
  className?: string;
}) {
  const isBookmarked = useStudyStore((s) => s.isBookmarked(id));
  const toggle = useStudyStore((s) => s.toggleBookmark);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(id, label, href);
      }}
      className={cn("rounded-lg p-1.5 text-muted hover:bg-surface-2 focus-ring", className)}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-accent text-accent")} />
    </button>
  );
}
