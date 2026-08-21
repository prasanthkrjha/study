"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Circle, BookOpen, ArrowRight } from "lucide-react";
import { syllabus } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { lessonId, lessonModuleProgress, conceptId, moduleProgress } from "@/lib/progress";
import { Card } from "@/components/shared/Card";
import { cn } from "@/lib/utils";
import type { Module } from "@/types/content";

const CATEGORIES: { label: string; color: string; accent: string; moduleNumbers: number[] }[] = [
  { label: "DSA", color: "var(--accent)", accent: "accent", moduleNumbers: [1] },
  { label: "Python", color: "var(--accent-2)", accent: "accent-2", moduleNumbers: [6] },
  { label: "AI / ML", color: "var(--accent-3)", accent: "accent-3", moduleNumbers: [7, 8] },
  {
    label: "Other",
    color: "#6366f1",
    accent: "indigo",
    moduleNumbers: [2, 3, 4, 5, 9],
  },
];

function UnitRow({
  unitId,
  title,
  concepts,
  completed,
  toggleCompleted,
  color,
}: {
  unitId: string;
  title: string;
  concepts: string[];
  completed: Record<string, boolean>;
  toggleCompleted: (id: string) => void;
  color: string;
}) {
  const lid = lessonId(unitId);
  const lessonDone = !!completed[lid];
  const conceptsDone = concepts.filter((_, i) => completed[conceptId(unitId, i)]).length;
  const pct = concepts.length > 0 ? Math.round((conceptsDone / concepts.length) * 100) : lessonDone ? 100 : 0;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 transition-colors hover:bg-surface-2">
      <button
        onClick={() => toggleCompleted(lid)}
        className="shrink-0 focus-ring rounded"
        aria-label={lessonDone ? "Mark lesson unread" : "Mark lesson as read"}
      >
        {lessonDone ? (
          <CheckCircle2 className="h-4 w-4" style={{ color }} />
        ) : (
          <Circle className="h-4 w-4 text-muted" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/learn/${unitId}`}
            className="truncate text-sm font-medium hover:underline"
          >
            {unitId} {title}
          </Link>
          <span className="shrink-0 text-xs text-muted">{pct}%</span>
        </div>
        {concepts.length > 0 && (
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
        )}
      </div>
      <Link href={`/learn/${unitId}`} className="shrink-0 text-muted hover:text-foreground">
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function ModuleSection({
  mod,
  color,
  completed,
  toggleCompleted,
}: {
  mod: Module;
  color: string;
  completed: Record<string, boolean>;
  toggleCompleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const lp = lessonModuleProgress(mod, completed);
  const cp = moduleProgress(mod, completed);

  return (
    <div className="rounded-2xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left focus-ring rounded-2xl"
      >
        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold truncate">
              Module {mod.number}: {mod.title}
            </span>
            <span className="shrink-0 text-xs text-muted">
              {lp.done}/{lp.total} lessons · {cp.pct}% concepts
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${cp.pct}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </button>

      {open && (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {mod.units.map((unit) => (
            <UnitRow
              key={unit.id}
              unitId={unit.id}
              title={unit.title}
              concepts={unit.concepts}
              completed={completed}
              toggleCompleted={toggleCompleted}
              color={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModulesPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const [activeCategory, setActiveCategory] = useState("All");

  const allModulesByNumber = Object.fromEntries(
    syllabus.modules.map((m) => [m.number, m])
  );

  const categoryTabs = ["All", ...CATEGORIES.map((c) => c.label)];

  const visibleCategories = activeCategory === "All"
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.label === activeCategory);

  // Total stats
  const totalLessons = syllabus.modules.reduce((s, m) => s + m.units.length, 0);
  const doneLessons = syllabus.modules.reduce(
    (s, m) => s + m.units.filter((u) => completed[lessonId(u.id)]).length,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Module-Wise Learning</h1>
          <p className="mt-1 text-sm text-muted">
            {doneLessons} of {totalLessons} lessons read across all modules
          </p>
        </div>
        <Link
          href="/syllabus"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:bg-surface-2"
        >
          <BookOpen className="h-4 w-4" />
          Full Syllabus
        </Link>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const mods = cat.moduleNumbers.map((n) => allModulesByNumber[n]).filter(Boolean);
          const total = mods.reduce((s, m) => s + m.units.length, 0);
          const done = mods.reduce(
            (s, m) => s + m.units.filter((u) => completed[lessonId(u.id)]).length,
            0
          );
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <div
              key={cat.label}
              className={cn(
                "cursor-pointer rounded-2xl border p-4 transition-all",
                activeCategory === cat.label
                  ? "border-2 bg-surface"
                  : "border-border bg-surface hover:bg-surface-2"
              )}
              style={activeCategory === cat.label ? { borderColor: cat.color } : {}}
              onClick={() => setActiveCategory(activeCategory === cat.label ? "All" : cat.label)}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: cat.color }}>
                  {cat.label}
                </span>
                <span className="text-xs text-muted">{done}/{total}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-muted">{pct}%</div>
            </div>
          );
        })}
      </div>

      {/* Tab filter */}
      <div className="flex flex-wrap gap-2">
        {categoryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              activeCategory === tab
                ? "bg-accent text-white"
                : "border border-border text-muted hover:bg-surface-2"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Module sections */}
      <div className="flex flex-col gap-4">
        {visibleCategories.map((cat) =>
          cat.moduleNumbers.map((n) => {
            const mod = allModulesByNumber[n];
            if (!mod) return null;
            return (
              <ModuleSection
                key={mod.id}
                mod={mod}
                color={cat.color}
                completed={completed}
                toggleCompleted={toggleCompleted}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
