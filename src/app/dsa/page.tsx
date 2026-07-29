"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CheckCircle2, AlertTriangle, RefreshCcw, Code2 } from "lucide-react";
import { roadmap } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { currentWeek, dsaProblemsSolved, dsaTopicStats } from "@/lib/progress";
import { totalDsaProblems } from "@/lib/data";
import { Card, StatCard } from "@/components/shared/Card";
import { cn } from "@/lib/utils";

export default function DsaTrackerPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const solved = dsaProblemsSolved(completed);
  const total = totalDsaProblems();
  const cw = currentWeek(completed);
  const currentWeekNumber = cw?.week.number ?? 1;

  const topics = roadmap.dsaTable.map((row, i) => ({
    ...row,
    stats: dsaTopicStats(row.weeks, row.problems, completed),
    index: i,
  }));

  const weak = topics.filter((t) => t.stats.end < currentWeekNumber && t.stats.pct < 100);
  const strong = topics.filter((t) => t.stats.pct === 100);
  const revision = strong.filter((t) => currentWeekNumber - t.stats.end >= 2);

  const chartData = topics.map((t) => ({
    name: t.topic.length > 18 ? t.topic.slice(0, 16) + "…" : t.topic,
    target: t.stats.target,
    solved: t.stats.solved,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">DSA Tracker</h1>
        <p className="mt-1 text-sm text-muted">
          Pattern-based progression through {roadmap.dsaTable.length} topic groups, from Part 4 of your roadmap.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Problems Solved" value={`${solved}/${total}`} icon={Code2} />
        <StatCard label="Patterns Mastered" value={`${strong.length}/${topics.length}`} icon={CheckCircle2} accent="var(--accent-2)" />
        <StatCard label="Weak Topics" value={weak.length} icon={AlertTriangle} accent="var(--danger)" />
        <StatCard label="Revision Needed" value={revision.length} icon={RefreshCcw} accent="var(--accent-3)" />
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Problems Solved vs. Target, by Pattern</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="target" fill="var(--border)" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="solved" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Pattern Roadmap</h2>
        <div className="flex flex-col gap-2">
          {topics.map((t) => (
            <Card key={t.index} className="flex items-center gap-4">
              <div className="w-16 shrink-0 text-xs text-muted">Wk {t.weeks}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">{t.topic}</span>
                  <span className="ml-2 shrink-0 text-xs text-muted">
                    {t.stats.solved}/{t.stats.target || t.problems}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      t.stats.pct === 100 ? "bg-accent-2" : "bg-accent"
                    )}
                    style={{ width: `${t.stats.pct}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted">cum. {t.cumulative}</span>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="mb-2 flex items-center gap-2 text-danger">
            <AlertTriangle className="h-4 w-4" /> <h3 className="font-semibold">Weak Topics</h3>
          </div>
          {weak.length === 0 ? (
            <p className="text-sm text-muted">None — you&apos;re on pace.</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {weak.map((t) => (
                <li key={t.index}>{t.topic} <span className="text-xs text-muted">({t.stats.pct}%)</span></li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="mb-2 flex items-center gap-2 text-accent-2">
            <CheckCircle2 className="h-4 w-4" /> <h3 className="font-semibold">Strong Topics</h3>
          </div>
          {strong.length === 0 ? (
            <p className="text-sm text-muted">Complete a topic to see it here.</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {strong.map((t) => (
                <li key={t.index}>{t.topic}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="mb-2 flex items-center gap-2 text-accent-3">
            <RefreshCcw className="h-4 w-4" /> <h3 className="font-semibold">Revision Due</h3>
          </div>
          <p className="mb-2 text-xs text-muted">
            Cold-redo 2–3 problems every 2 weeks — that&apos;s what builds retention.
          </p>
          {revision.length === 0 ? (
            <p className="text-sm text-muted">Nothing due yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {revision.map((t) => (
                <li key={t.index}>{t.topic}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
