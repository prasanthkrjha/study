"use client";

import Link from "next/link";
import { syllabus } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { moduleProgress } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { TierBadge } from "@/components/shared/TierBadge";
import { ArrowRight } from "lucide-react";

export default function SyllabusPage() {
  const completed = useStudyStore((s) => s.completedIds);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{syllabus.title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">{syllabus.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {syllabus.modules.map((mod) => {
          const mp = moduleProgress(mod, completed);
          return (
            <Link key={mod.id} href={`/syllabus/${mod.id}`}>
              <Card className="flex h-full flex-col gap-3 transition hover:border-accent/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-accent">
                      Module {mod.number}
                    </div>
                    <h2 className="mt-1 font-semibold leading-snug">{mod.title}</h2>
                  </div>
                  <ProgressRing value={mp.pct} size={44} strokeWidth={4} />
                </div>
                <p className="line-clamp-2 flex-1 text-xs text-muted">{mod.objective}</p>
                <div className="flex items-center justify-between">
                  <TierBadge tier={mod.tier} />
                  <span className="flex items-center gap-1 text-xs text-muted">
                    {mod.units.length} units <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
