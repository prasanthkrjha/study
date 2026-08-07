"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, CheckCircle2, XCircle, TrendingUp, CalendarDays, Clock, Filter } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { roadmap, syllabus } from "@/lib/data";
import { Card, StatCard } from "@/components/shared/Card";
import {
  resolveActivity,
  buildCategoryDistribution,
  buildTopicDurations,
  formatRelativeTime,
  formatDuration,
  categoryColor,
  mostProductiveDay,
  todayIso,
  type ResolvedActivity,
} from "@/lib/activity";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;

type ActionFilter = "all" | "completed" | "uncompleted";

function CategoryBadge({ category }: { category: string }) {
  const color = categoryColor(category);
  return (
    <span
      className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {category}
    </span>
  );
}

function ActivityRow({ r }: { r: ResolvedActivity }) {
  const isCompleted = r.entry.action === "completed";
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 text-sm">
      <div className="mt-0.5 shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-accent" />
        ) : (
          <XCircle className="h-4 w-4 text-muted" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium leading-snug" title={r.label}>
          {r.label}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={r.category} />
          <span className="text-[11px] text-muted">
            {new Date(r.entry.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-xs text-muted">{formatRelativeTime(r.entry.timestamp)}</span>
    </div>
  );
}

function PieLegend({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="mt-3 flex flex-col gap-1.5">
      {data.map((d) => (
        <div key={d.name} className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="truncate text-muted" title={d.name}>{d.name}</span>
          </div>
          <span className="shrink-0 font-medium">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ActivityPage() {
  const activityLog = useStudyStore((s) => s.activityLog);
  const studyDates = useStudyStore((s) => s.studyDates);

  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Resolve all entries (newest first)
  const resolved = useMemo(() => {
    const all: ResolvedActivity[] = [];
    for (let i = activityLog.length - 1; i >= 0; i--) {
      all.push(resolveActivity(activityLog[i], roadmap, syllabus));
    }
    return all;
  }, [activityLog]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of resolved) set.add(r.category);
    return Array.from(set).sort();
  }, [resolved]);

  const filtered = useMemo(() => {
    return resolved.filter((r) => {
      if (actionFilter !== "all" && r.entry.action !== actionFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      return true;
    });
  }, [resolved, actionFilter, categoryFilter]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  // Stats
  const totalCompletions = useMemo(
    () => activityLog.filter((e) => e.action === "completed").length,
    [activityLog]
  );

  const todayCompletions = useMemo(
    () => activityLog.filter((e) => e.action === "completed" && e.timestamp.startsWith(todayIso())).length,
    [activityLog]
  );

  const bestDay = useMemo(() => mostProductiveDay(activityLog), [activityLog]);

  const avgPerDay = studyDates.length > 0 ? (totalCompletions / studyDates.length).toFixed(1) : "—";

  // Pie chart data
  const pieData = useMemo(
    () => buildCategoryDistribution(resolved),
    [resolved]
  );

  // Topic durations (most recent first, already sorted)
  const topicDurations = useMemo(
    () => buildTopicDurations(activityLog, roadmap, syllabus),
    [activityLog]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity & Completion History</h1>
        <p className="mt-1 text-sm text-muted">
          Every topic you mark complete is logged here with an exact timestamp.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Completions" value={totalCompletions} icon={CheckCircle2} />
        <StatCard label="Today" value={todayCompletions} icon={Activity} accent="var(--accent-2)" />
        <StatCard
          label="Best Day"
          value={bestDay ? `${bestDay.count}` : "—"}
          hint={bestDay ? bestDay.date : undefined}
          icon={TrendingUp}
          accent="var(--accent-3)"
        />
        <StatCard label="Avg / Active Day" value={avgPerDay} icon={CalendarDays} />
      </div>

      {activityLog.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <Activity className="h-10 w-10 text-muted" />
          <p className="font-medium">No activity yet</p>
          <p className="text-sm text-muted">
            Check off tasks and concepts to start building your history.
          </p>
        </Card>
      ) : (
        <>
          {/* Main two-column section */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Activity list */}
            <Card className="flex flex-col gap-3 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">Activity History</h2>
                <span className="text-xs text-muted">{filtered.length} entries</span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg border border-border text-xs">
                  {(["all", "completed", "uncompleted"] as ActionFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setActionFilter(f); setPage(1); }}
                      className={cn(
                        "px-3 py-1.5 capitalize first:rounded-l-lg last:rounded-r-lg transition-colors",
                        actionFilter === f
                          ? "bg-accent text-white"
                          : "text-muted hover:bg-surface-2"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1">
                  <Filter className="h-3.5 w-3.5 text-muted" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                    className="bg-transparent text-xs text-foreground outline-none"
                  >
                    <option value="all">All categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Entries */}
              <div className="flex flex-col gap-2">
                {paginated.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted">No entries match this filter.</p>
                ) : (
                  paginated.map((r, i) => <ActivityRow key={i} r={r} />)
                )}
              </div>

              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="mt-1 rounded-lg border border-border py-2 text-sm text-muted hover:bg-surface-2"
                >
                  Load more ({filtered.length - paginated.length} remaining)
                </button>
              )}
            </Card>

            {/* Pie chart */}
            <Card className="flex flex-col gap-2">
              <h2 className="font-semibold">Activity by Category</h2>
              <p className="text-xs text-muted">Completions per topic area</p>
              {pieData.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">No completions yet.</p>
              ) : (
                <>
                  <div className="h-48">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={40}
                          outerRadius={72}
                          paddingAngle={2}
                        >
                          {pieData.map((d, i) => (
                            <Cell key={i} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(value, name) => [value, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <PieLegend data={pieData} />
                </>
              )}
            </Card>
          </div>

          {/* Topic completion timeline */}
          {topicDurations.length > 0 && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <h2 className="font-semibold">Time to Complete Topics</h2>
                <span className="ml-auto text-xs text-muted">From first to last item in each topic</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted">
                      <th className="pb-2 pr-4 font-medium">Topic</th>
                      <th className="pb-2 pr-4 font-medium">Type</th>
                      <th className="pb-2 pr-4 font-medium">Started</th>
                      <th className="pb-2 pr-4 font-medium">Last Activity</th>
                      <th className="pb-2 pr-4 font-medium">Duration</th>
                      <th className="pb-2 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topicDurations.map((d) => (
                      <tr key={d.id} className="text-xs">
                        <td className="py-2.5 pr-4 font-medium" style={{ maxWidth: 220 }}>
                          <span className="line-clamp-2">{d.label}</span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                              d.type === "week"
                                ? "bg-accent/10 text-accent"
                                : "bg-accent-2/10 text-accent-2"
                            )}
                          >
                            {d.type === "week" ? "Roadmap Week" : "Syllabus Unit"}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-muted">
                          {new Date(d.firstAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 pr-4 text-muted">
                          {new Date(d.lastAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 pr-4 font-medium">
                          {formatDuration(d.durationMs)}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                              <div
                                className="h-full rounded-full bg-accent transition-all"
                                style={{
                                  width: `${d.totalCount > 0 ? Math.round((d.completedCount / d.totalCount) * 100) : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-muted">
                              {d.completedCount}/{d.totalCount}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
