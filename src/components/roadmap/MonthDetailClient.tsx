"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, FolderGit2 } from "lucide-react";
import { roadmap } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { monthProgress, milestoneId } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { Checkbox } from "@/components/shared/Checkbox";
import { WeekAccordion } from "@/components/roadmap/WeekAccordion";

export function MonthDetailClient({ monthId }: { monthId: string }) {
  const month = roadmap.months.find((m) => m.id === monthId)!;
  const idx = roadmap.months.findIndex((m) => m.id === monthId);
  const prev = roadmap.months[idx - 1];
  const next = roadmap.months[idx + 1];

  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const mp = monthProgress(month, completed);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/roadmap" className="text-sm text-muted hover:text-foreground">
          ← All months
        </Link>
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/roadmap/${prev.id}`}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Month {prev.number}
            </Link>
          )}
          {next && (
            <Link
              href={`/roadmap/${next.id}`}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
            >
              Month {next.number} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <Card className="flex items-center justify-between gap-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-accent">Month {month.number}</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{month.title}</h1>
          {month.focus && <p className="mt-2 max-w-2xl text-sm text-muted">{month.focus}</p>}
        </div>
        <ProgressRing value={mp.pct} size={80} strokeWidth={7} />
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Weeks</h2>
        {month.weeks.map((week) => (
          <WeekAccordion key={week.id} week={week} defaultOpen={monthProgress(month, completed).pct < 100} />
        ))}
      </div>

      {month.projectText && (
        <Card>
          <div className="mb-2 flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-accent" />
            <h2 className="font-semibold">Project</h2>
          </div>
          <p className="text-sm text-muted">{month.projectText}</p>
          <Link href="/projects" className="mt-3 inline-block text-xs text-accent hover:underline">
            View in Project Tracker →
          </Link>
        </Card>
      )}

      {month.milestones.length > 0 && (
        <Card>
          <h2 className="mb-3 font-semibold">Month {month.number} Milestones</h2>
          <div className="flex flex-col gap-2">
            {month.milestones.map((ms) => {
              const id = milestoneId(ms.id);
              return (
                <label key={ms.id} className="flex items-start gap-3 text-sm">
                  <Checkbox checked={!!completed[id]} onChange={() => toggleCompleted(id)} />
                  <span className={completed[id] ? "text-muted line-through" : ""}>{ms.text}</span>
                </label>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
