"use client";

import Link from "next/link";
import { roadmap } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { monthProgress } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { ArrowRight, Calendar } from "lucide-react";

export default function RoadmapPage() {
  const completed = useStudyStore((s) => s.completedIds);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{roadmap.title}</h1>
        <p className="mt-1 text-sm text-muted">{roadmap.meta["Based on"]}</p>
      </div>

      <div className="relative flex flex-col gap-6 pl-8">
        <div className="absolute bottom-4 left-[15px] top-4 w-px bg-border" />
        {roadmap.months.map((month) => {
          const mp = monthProgress(month, completed);
          return (
            <div key={month.id} className="relative">
              <div
                className="absolute -left-8 top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-surface text-xs font-bold text-accent"
                style={{ boxShadow: mp.pct === 100 ? "0 0 0 4px color-mix(in srgb, var(--accent) 20%, transparent)" : undefined }}
              >
                {month.number}
              </div>
              <Link href={`/roadmap/${month.id}`}>
                <Card className="flex items-center justify-between gap-4 transition hover:border-accent/40 hover:shadow-md">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
                      <Calendar className="h-3.5 w-3.5" /> Month {month.number}
                    </div>
                    <h2 className="mt-1 truncate text-lg font-semibold">{month.title}</h2>
                    {month.focus && <p className="mt-1 line-clamp-2 text-sm text-muted">{month.focus}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${mp.pct}%` }} />
                      </div>
                      <span className="text-xs text-muted">
                        {mp.done}/{mp.total} tasks
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <ProgressRing value={mp.pct} size={52} strokeWidth={5} />
                    <ArrowRight className="h-4 w-4 text-muted" />
                  </div>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
