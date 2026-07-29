"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRightCircle, StickyNote } from "lucide-react";
import type { Week } from "@/types/content";
import { useStudyStore } from "@/lib/store";
import { taskId, weekProgress } from "@/lib/progress";
import { linkForTask, moduleIdForNumber } from "@/lib/data";
import { Checkbox } from "@/components/shared/Checkbox";
import { BookmarkButton } from "@/components/shared/BookmarkButton";
import { cn } from "@/lib/utils";

const COLUMN_COLORS: Record<string, string> = {
  DSA: "var(--accent)",
  "Full-Stack": "var(--accent-2)",
  "AI/Python": "var(--accent-3)",
  AI: "var(--accent-3)",
  "System Design": "var(--accent-2)",
  Behavioral: "var(--danger)",
  Applications: "var(--muted)",
};

export function WeekAccordion({ week, defaultOpen = false }: { week: Week; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const addNote = useStudyStore((s) => s.addNote);
  const wp = weekProgress(week, completed);

  return (
    <div id={week.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 focus-ring"
      >
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
        <span className="font-medium">Week {week.number}</span>
        <div className="ml-2 h-1.5 flex-1 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${wp.pct}%` }} />
        </div>
        <span className="shrink-0 text-xs text-muted">
          {wp.done}/{wp.total}
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-2 border-t border-border p-4">
          {week.tasks.map((task, i) => {
            const id = taskId(week.id, task.column, i);
            const link = linkForTask(week.id, task.text);
            const color = COLUMN_COLORS[task.column] ?? "var(--accent)";
            return (
              <div
                key={id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 text-sm transition",
                  completed[id] && "opacity-60"
                )}
              >
                <Checkbox checked={!!completed[id]} onChange={() => toggleCompleted(id)} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {task.column}
                    </span>
                    {task.problems && (
                      <span className="text-[10px] text-muted">~{task.problems} problems</span>
                    )}
                  </div>
                  <p className={cn("mt-1", completed[id] && "line-through")}>{task.text}</p>
                  {link && (
                    <Link
                      href={`/syllabus/${moduleIdForNumber(link.moduleNumber)}#unit-${link.unitId.replace(".", "-")}`}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                    >
                      <ArrowRightCircle className="h-3.5 w-3.5" /> Open Unit {link.unitId} in syllabus
                    </Link>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    onClick={() => {
                      const text = prompt("Add a note for this task:");
                      if (text) addNote(text, id, `Week ${week.number} · ${task.text}`);
                    }}
                    className="rounded-lg p-1.5 text-muted hover:bg-surface-2 focus-ring"
                    title="Add note"
                  >
                    <StickyNote className="h-4 w-4" />
                  </button>
                  <BookmarkButton id={id} label={`Week ${week.number} · ${task.text}`} href={`#${week.id}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
