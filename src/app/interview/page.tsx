"use client";

import { syllabus, roadmap } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { moduleProgress } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { UnitAccordion } from "@/components/syllabus/UnitAccordion";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

export default function InterviewPrepPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const interviewModule = syllabus.modules.find((m) => /interview/i.test(m.title));
  const detailSection = roadmap.sections.find((s) => /part 7/i.test(s.title));
  const mp = interviewModule ? moduleProgress(interviewModule, completed) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Preparation</h1>
          <p className="mt-1 text-sm text-muted">
            Technical, behavioral, and mock-practice tracking pulled from Module 9 and Part 7 of your plan.
          </p>
        </div>
        {mp && <ProgressRing value={mp.pct} size={64} strokeWidth={5} />}
      </div>

      {interviewModule && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Prep Checklist</h2>
          {interviewModule.units.map((unit) => (
            <UnitAccordion key={unit.id} unit={unit} defaultOpen />
          ))}
        </div>
      )}

      {detailSection && (
        <Card>
          <h2 className="mb-3 font-semibold">Deep Dive — Topics, STAR Stories &amp; Cadence</h2>
          <MarkdownContent markdown={detailSection.contentMarkdown.replace(/^##[^\n]*\n/, "")} />
        </Card>
      )}
    </div>
  );
}
