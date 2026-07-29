"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { roadmap } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { resourceId } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { Checkbox } from "@/components/shared/Checkbox";
import { BookmarkButton } from "@/components/shared/BookmarkButton";
import { cn } from "@/lib/utils";

export default function ResourcesPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(roadmap.resources.map((r) => r.category))),
    []
  );

  const filtered = roadmap.resources.filter((r) => {
    if (category && r.category !== category) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Resources</h1>
        <p className="mt-1 text-sm text-muted">
          {roadmap.resources.length} resources extracted from the roadmap&apos;s learning guide, grouped by category.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              !category ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:bg-surface-2"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                category === c ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:bg-surface-2"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const id = resourceId(r.id);
          return (
            <Card key={r.id} id={r.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  {r.category}
                </span>
                <BookmarkButton id={id} label={r.title} href={`/resources#${r.id}`} />
              </div>
              <h3 className="font-semibold leading-snug">{r.title}</h3>
              <p className="line-clamp-3 flex-1 text-xs text-muted">{r.description}</p>
              <div className="flex items-center justify-between pt-1">
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted">No link — search the title</span>
                )}
                <label className="flex items-center gap-1.5 text-xs text-muted">
                  <Checkbox checked={!!completed[id]} onChange={() => toggleCompleted(id)} size={16} />
                  Done
                </label>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
