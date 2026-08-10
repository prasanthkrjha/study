"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { syllabus } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { lessonModuleProgress, moduleProgress } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { TierBadge } from "@/components/shared/TierBadge";
import { UnitAccordion } from "@/components/syllabus/UnitAccordion";

export function ModuleDetailClient({ moduleId }: { moduleId: string }) {
  const mod = syllabus.modules.find((m) => m.id === moduleId)!;
  const idx = syllabus.modules.findIndex((m) => m.id === moduleId);
  const prev = syllabus.modules[idx - 1];
  const next = syllabus.modules[idx + 1];

  const completed = useStudyStore((s) => s.completedIds);
  const mp = moduleProgress(mod, completed);
  const lp = lessonModuleProgress(mod, completed);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/syllabus" className="text-sm text-muted hover:text-foreground">
          ← All modules
        </Link>
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/syllabus/${prev.id}`}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Module {prev.number}
            </Link>
          )}
          {next && (
            <Link
              href={`/syllabus/${next.id}`}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
            >
              Module {next.number} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <Card className="flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
            Module {mod.number} <TierBadge tier={mod.tier} />
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{mod.title}</h1>
          {mod.objective && <p className="mt-2 max-w-2xl text-sm text-muted">{mod.objective}</p>}
          <p className="mt-1 text-xs text-muted">{lp.done}/{lp.total} lessons read</p>
        </div>
        <ProgressRing value={mp.pct} size={80} strokeWidth={7} />
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Units ({mod.units.length})
        </h2>
        {mod.units.map((unit) => (
          <UnitAccordion key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
