"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, StickyNote, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { allUnits, syllabus, getLesson, linksForUnit, moduleIdForNumber } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { conceptId, lessonId, unitProgress } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { Checkbox } from "@/components/shared/Checkbox";
import { TierBadge } from "@/components/shared/TierBadge";
import { BookmarkButton } from "@/components/shared/BookmarkButton";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { TableOfContents } from "@/components/shared/TableOfContents";

export function LessonClient({ unitId }: { unitId: string }) {
  const units = allUnits();
  const idx = units.findIndex((u) => u.id === unitId);
  const unit = units[idx];
  const prev = units[idx - 1];
  const next = units[idx + 1];
  const mod = syllabus.modules.find((m) => m.number === unit.moduleNumber)!;

  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const addNote = useStudyStore((s) => s.addNote);
  const up = unitProgress(unit, completed);
  const lid = lessonId(unit.id);
  const lessonDone = !!completed[lid];
  const roadmapLinks = linksForUnit(unit.id);
  const lessonMarkdown = getLesson(unit.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <div className="flex items-center gap-1.5">
          <Link href="/syllabus" className="hover:text-foreground">
            Syllabus
          </Link>
          <span>/</span>
          <Link href={`/syllabus/${mod.id}`} className="hover:text-foreground">
            Module {mod.number}
          </Link>
          <span>/</span>
          <span className="text-foreground">Unit {unit.id}</span>
        </div>
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/learn/${prev.id}`}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> {prev.id}
            </Link>
          )}
          {next && (
            <Link
              href={`/learn/${next.id}`}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
            >
              {next.id} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <Card className="flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
            Unit {unit.id} <TierBadge tier={unit.tier} />
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{unit.title}</h1>
          <p className="mt-1 text-sm text-muted">
            Module {mod.number} — {mod.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BookmarkButton id={`unit:${unit.id}`} label={`${unit.id} ${unit.title}`} href={`/learn/${unit.id}`} />
          <ProgressRing value={up.pct} size={64} strokeWidth={5} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {lessonMarkdown ? (
            <MarkdownContent markdown={lessonMarkdown} />
          ) : (
            <p className="text-sm text-muted">
              A full study lesson for this unit hasn&apos;t been written yet.
            </p>
          )}
        </Card>

        <div className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          {lessonMarkdown && (
            <Card>
              <TableOfContents markdown={lessonMarkdown} />
            </Card>
          )}
          {unit.practiceLinks.length > 0 && (
            <Card>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Practice &amp; Reference Links
              </h2>
              <div className="flex flex-col gap-2">
                {unit.practiceLinks.map((pl) => (
                  <a
                    key={pl.url}
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-accent hover:border-accent/40"
                  >
                    {pl.label}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <BookOpen className="h-4 w-4 text-accent" /> Concept Checklist
            </h2>
            <div className="flex flex-col gap-1.5">
              {unit.concepts.map((concept, i) => {
                const id = conceptId(unit.id, i);
                return (
                  <label key={id} className="flex items-start gap-2.5 text-sm">
                    <Checkbox checked={!!completed[id]} onChange={() => toggleCompleted(id)} size={16} />
                    <span className={completed[id] ? "text-muted line-through" : ""}>{concept}</span>
                  </label>
                );
              })}
            </div>
          </Card>

          {(unit.primaryResource || unit.secondaryResource || unit.doneCriteria) && (
            <Card className="flex flex-col gap-3 text-sm">
              {unit.primaryResource && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    Primary Resource
                  </h3>
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
            </Card>
          )}

          {roadmapLinks.length > 0 && (
            <Card>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Scheduled In Roadmap
              </h2>
              <div className="flex flex-col gap-1.5">
                {roadmapLinks.map((l) => (
                  <Link
                    key={l.weekId + l.taskText}
                    href={`/roadmap/${l.monthId}#${l.weekId}`}
                    className="text-xs text-accent hover:underline"
                  >
                    {l.taskText}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          <button
            onClick={() => toggleCompleted(lid)}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              lessonDone
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border hover:bg-surface-2"
            }`}
          >
            {lessonDone ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Lesson marked as read
              </>
            ) : (
              <>
                <Circle className="h-3.5 w-3.5" /> Mark lesson as read
              </>
            )}
          </button>

          <button
            onClick={() => {
              const text = prompt(`Add a note for ${unit.id} ${unit.title}:`);
              if (text) addNote(text, `unit:${unit.id}`, `${unit.id} ${unit.title}`);
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs hover:bg-surface-2"
          >
            <StickyNote className="h-3.5 w-3.5" /> Add note for this unit
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        {prev ? (
          <Link href={`/learn/${prev.id}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-accent">
            <ChevronLeft className="h-4 w-4" /> {prev.id} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/learn/${next.id}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-accent">
            {next.id} {next.title} <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
