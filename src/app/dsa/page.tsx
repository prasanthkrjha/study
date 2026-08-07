"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ExternalLink,
  StickyNote,
  Code2,
  Target,
  BookOpen,
  Hash,
  X,
} from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { Card, StatCard } from "@/components/shared/Card";
import { dsaTopics } from "@/data/dsa-problems";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/dsa";

const DIFFICULTY_STYLES: Record<Difficulty, { label: string; className: string }> = {
  Easy: { label: "Easy", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  Medium: { label: "Medium", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  Hard: { label: "Hard", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const style = DIFFICULTY_STYLES[difficulty];
  return (
    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold", style.className)}>
      {style.label}
    </span>
  );
}

function NoteModal({
  problemTitle,
  notes,
  onSave,
  onClose,
}: {
  problemTitle: string;
  notes: string;
  onSave: (n: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(notes);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Notes — {problemTitle}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-surface-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          placeholder="Approach, edge cases, time/space complexity, key insight…"
          className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          autoFocus
        />
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-2">
            Cancel
          </button>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

type DiffFilter = "All" | Difficulty;

function TopicCard({ topic }: { topic: typeof dsaTopics[number] }) {
  const dsaProblemStatus = useStudyStore((s) => s.dsaProblemStatus);
  const toggleDsaProblem = useStudyStore((s) => s.toggleDsaProblem);
  const setDsaProblemNote = useStudyStore((s) => s.setDsaProblemNote);

  const [open, setOpen] = useState(false);
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("All");
  const [noteTarget, setNoteTarget] = useState<{ id: string; title: string; notes: string } | null>(null);

  const totalProblems = topic.problems.length;
  const solvedCount = topic.problems.filter((p) => dsaProblemStatus[p.id]?.completed).length;
  const pct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  const filtered = useMemo(
    () => (diffFilter === "All" ? topic.problems : topic.problems.filter((p) => p.difficulty === diffFilter)),
    [topic.problems, diffFilter]
  );

  const diffCounts = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    for (const p of topic.problems) counts[p.difficulty]++;
    return counts;
  }, [topic.problems]);

  return (
    <>
      {noteTarget && (
        <NoteModal
          problemTitle={noteTarget.title}
          notes={noteTarget.notes}
          onSave={(n) => setDsaProblemNote(noteTarget.id, n)}
          onClose={() => setNoteTarget(null)}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Header row */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 focus-ring"
        >
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{topic.title}</span>
              <span className="shrink-0 text-xs text-muted">
                {solvedCount}/{totalProblems} solved
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-accent-2" : "bg-accent")}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex shrink-0 gap-1 text-[10px]">
            {diffCounts.Easy > 0 && (
              <span className="rounded bg-green-500/10 px-1 py-0.5 font-medium text-green-600 dark:text-green-400">
                {diffCounts.Easy}E
              </span>
            )}
            {diffCounts.Medium > 0 && (
              <span className="rounded bg-yellow-500/10 px-1 py-0.5 font-medium text-yellow-600 dark:text-yellow-400">
                {diffCounts.Medium}M
              </span>
            )}
            {diffCounts.Hard > 0 && (
              <span className="rounded bg-red-500/10 px-1 py-0.5 font-medium text-red-600 dark:text-red-400">
                {diffCounts.Hard}H
              </span>
            )}
          </div>
        </button>

        {open && (
          <div className="border-t border-border">
            {/* Topic description */}
            <p className="px-4 py-3 text-sm text-muted">{topic.description}</p>

            {/* Difficulty filter */}
            <div className="flex gap-1 border-t border-border px-4 py-2">
              {(["All", "Easy", "Medium", "Hard"] as DiffFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setDiffFilter(f)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    diffFilter === f
                      ? "bg-accent text-white"
                      : "text-muted hover:bg-surface-2"
                  )}
                >
                  {f}
                  {f !== "All" && ` (${diffCounts[f as Difficulty]})`}
                </button>
              ))}
            </div>

            {/* Problem list */}
            <div className="divide-y divide-border">
              {filtered.map((problem) => {
                const status = dsaProblemStatus[problem.id];
                const completed = status?.completed ?? false;
                const hasNotes = !!status?.notes;

                return (
                  <div
                    key={problem.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 text-sm transition-colors",
                      completed && "bg-accent/5"
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleDsaProblem(problem.id)}
                      className="mt-0.5 shrink-0 text-muted transition-colors hover:text-accent focus-ring rounded"
                      aria-label={completed ? "Mark as unsolved" : "Mark as solved"}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-accent" style={{ height: 18, width: 18 }} />
                      ) : (
                        <Circle className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                      )}
                    </button>

                    {/* Problem info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("font-medium", completed && "text-muted line-through")}>
                          {problem.title}
                        </span>
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </div>

                      {/* Pattern + tags */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                        <span className="flex items-center gap-0.5">
                          <Hash className="h-3 w-3" />{problem.pattern}
                        </span>
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* User notes preview */}
                      {status?.notes && (
                        <p className="mt-1 text-[11px] italic text-muted line-clamp-1">{status.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <a
                        href={problem.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open on LeetCode"
                        className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 text-[10px] font-semibold hover:border-accent/40 hover:text-accent"
                      >
                        LC <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                      {problem.hackerrankUrl && (
                        <a
                          href={problem.hackerrankUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open on HackerRank"
                          className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 text-[10px] font-semibold hover:border-accent/40 hover:text-accent"
                        >
                          HR <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setNoteTarget({ id: problem.id, title: problem.title, notes: status?.notes ?? "" })}
                        title="Add / edit notes"
                        className={cn(
                          "rounded-lg p-1.5 transition-colors hover:bg-surface-2 focus-ring",
                          hasNotes ? "text-accent-2" : "text-muted"
                        )}
                      >
                        <StickyNote className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function DsaTrackerPage() {
  const dsaProblemStatus = useStudyStore((s) => s.dsaProblemStatus);

  const allProblems = useMemo(() => dsaTopics.flatMap((t) => t.problems), []);
  const totalCount = allProblems.length;
  const solvedCount = useMemo(
    () => allProblems.filter((p) => dsaProblemStatus[p.id]?.completed).length,
    [allProblems, dsaProblemStatus]
  );

  const topicStats = useMemo(
    () =>
      dsaTopics.map((t) => ({
        name: t.title.length > 18 ? t.title.slice(0, 16) + "…" : t.title,
        fullName: t.title,
        total: t.problems.length,
        solved: t.problems.filter((p) => dsaProblemStatus[p.id]?.completed).length,
      })),
    [dsaProblemStatus]
  );

  const masteredCount = topicStats.filter((t) => t.solved === t.total && t.total > 0).length;

  const diffStats = useMemo(() => {
    const counts = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } };
    for (const p of allProblems) {
      counts[p.difficulty].total++;
      if (dsaProblemStatus[p.id]?.completed) counts[p.difficulty].solved++;
    }
    return counts;
  }, [allProblems, dsaProblemStatus]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">DSA Tracker</h1>
        <p className="mt-1 text-sm text-muted">
          {dsaTopics.length} topics · {totalCount} curated problems with direct LeetCode links, difficulty ratings, and per-problem notes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Problems Solved" value={`${solvedCount}/${totalCount}`} icon={Code2} />
        <StatCard
          label="Topics Mastered"
          value={`${masteredCount}/${dsaTopics.length}`}
          icon={CheckCircle2}
          accent="var(--accent-2)"
        />
        <StatCard label="Easy" value={`${diffStats.Easy.solved}/${diffStats.Easy.total}`} icon={Target} accent="var(--accent-3)" />
        <StatCard label="Medium + Hard" value={`${diffStats.Medium.solved + diffStats.Hard.solved}/${diffStats.Medium.total + diffStats.Hard.total}`} icon={BookOpen} />
      </div>

      {/* Difficulty breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => {
          const s = diffStats[d];
          const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
          return (
            <Card key={d} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <DifficultyBadge difficulty={d} />
                <span className="text-xs font-medium text-muted">{s.solved}/{s.total}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    d === "Easy" ? "bg-green-500" : d === "Medium" ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted">{pct}% complete</span>
            </Card>
          );
        })}
      </div>

      {/* Progress chart */}
      <Card>
        <h2 className="mb-4 font-semibold">Progress by Topic</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={topicStats} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-35} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(value, name, props) => {
                  const item = topicStats.find((t) => t.name === props.payload.name);
                  return [value, name === "solved" ? `Solved (${item?.total} total)` : "Total"];
                }}
                labelFormatter={(label) => topicStats.find((t) => t.name === label)?.fullName ?? label}
              />
              <Bar dataKey="total" fill="var(--border)" radius={[4, 4, 0, 0]} name="total" />
              <Bar dataKey="solved" fill="var(--accent)" radius={[4, 4, 0, 0]} name="solved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Topic cards */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Problem Roadmap</h2>
        <div className="flex flex-col gap-2">
          {dsaTopics.map((topic) => (
            <TopicCard key={topic.unitId} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
