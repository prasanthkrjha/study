"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeftCircle, ExternalLink, StickyNote } from "lucide-react";
import type { Unit } from "@/types/content";
import { useStudyStore } from "@/lib/store";
import { conceptId, unitProgress } from "@/lib/progress";
import { linksForUnit } from "@/lib/data";
import { Checkbox } from "@/components/shared/Checkbox";
import { TierBadge } from "@/components/shared/TierBadge";
import { BookmarkButton } from "@/components/shared/BookmarkButton";
import { cn } from "@/lib/utils";

export function UnitAccordion({ unit, defaultOpen = false }: { unit: Unit; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const addNote = useStudyStore((s) => s.addNote);
  const up = unitProgress(unit, completed);
  const roadmapLinks = linksForUnit(unit.id);
  const anchorId = `unit-${unit.id.replace(".", "-")}`;

  return (
    <div id={anchorId} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-1 hover:bg-surface-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-3 px-4 py-3 text-left focus-ring"
        >
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {unit.id} {unit.title}
              </span>
              <TierBadge tier={unit.tier} />
            </div>
          </div>
          <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent-2 transition-all" style={{ width: `${up.pct}%` }} />
          </div>
        </button>
        <BookmarkButton id={`unit:${unit.id}`} label={`${unit.id} ${unit.title}`} href={`#${anchorId}`} className="mr-3" />
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-border p-4 text-sm">
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Concepts</h3>
            <div className="flex flex-col gap-1.5">
              {unit.concepts.map((concept, i) => {
                const id = conceptId(unit.id, i);
                return (
                  <label key={id} className="flex items-start gap-2.5">
                    <Checkbox checked={!!completed[id]} onChange={() => toggleCompleted(id)} size={16} />
                    <span className={completed[id] ? "text-muted line-through" : ""}>{concept}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {unit.primaryResource && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Primary Resource</h3>
              <p className="flex items-start gap-1.5 text-muted">
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {unit.primaryResource}
              </p>
            </div>
          )}
          {unit.secondaryResource && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                If This Doesn&apos;t Land
              </h3>
              <p className="text-muted">{unit.secondaryResource}</p>
            </div>
          )}
          {unit.doneCriteria && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Completion Criteria
              </h3>
              <p className="text-muted">{unit.doneCriteria}</p>
            </div>
          )}

          {roadmapLinks.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Scheduled In Roadmap
              </h3>
              <div className="flex flex-col gap-1.5">
                {roadmapLinks.map((l) => (
                  <Link
                    key={l.weekId + l.taskText}
                    href={`/roadmap/${l.monthId}#${l.weekId}`}
                    className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                  >
                    <ArrowLeftCircle className="h-3.5 w-3.5" /> {l.taskText}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              const text = prompt(`Add a note for ${unit.id} ${unit.title}:`);
              if (text) addNote(text, `unit:${unit.id}`, `${unit.id} ${unit.title}`);
            }}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
          >
            <StickyNote className="h-3.5 w-3.5" /> Add note
          </button>
        </div>
      )}
    </div>
  );
}
