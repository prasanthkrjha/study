import type { RoadmapData, SyllabusData } from "@/types/content";
import type { ActivityEntry } from "@/lib/store";

export interface ResolvedActivity {
  entry: ActivityEntry;
  label: string;
  category: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  DSA: "var(--accent)",
  "Full-Stack": "var(--accent-2)",
  "AI/Python": "var(--accent-3)",
  "System Design": "#6366f1",
  Behavioral: "var(--danger)",
  Applications: "#0ea5e9",
  Milestone: "#f59e0b",
  Project: "#10b981",
  Resource: "#8b8ba0",
  Other: "#64748b",
};

// Fallback palette for dynamically discovered categories (e.g. "M1: …")
const PALETTE = [
  "#a78bfa", "#34d399", "#fb923c", "#38bdf8", "#f472b6",
  "#facc15", "#4ade80", "#60a5fa", "#c084fc", "#f87171",
];
const dynamicColorCache: Record<string, string> = {};
let paletteIndex = 0;

export function categoryColor(cat: string): string {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  if (!dynamicColorCache[cat]) {
    dynamicColorCache[cat] = PALETTE[paletteIndex % PALETTE.length];
    paletteIndex++;
  }
  return dynamicColorCache[cat];
}

export function resolveActivity(
  entry: ActivityEntry,
  roadmap: RoadmapData,
  syllabus: SyllabusData
): ResolvedActivity {
  const { id } = entry;

  if (id.startsWith("task:")) {
    const parts = id.split(":");
    const weekId = parts[1];
    const column = parts[2];
    const index = parseInt(parts[3], 10);
    for (const month of roadmap.months) {
      const week = month.weeks.find((w) => w.id === weekId);
      if (week) {
        return { entry, label: week.tasks[index]?.text ?? id, category: column };
      }
    }
    return { entry, label: id, category: column ?? "Task" };
  }

  if (id.startsWith("concept:")) {
    const parts = id.split(":");
    const unitId = parts[1];
    const index = parseInt(parts[2], 10);
    for (const mod of syllabus.modules) {
      const unit = mod.units.find((u) => u.id === unitId);
      if (unit) {
        return {
          entry,
          label: unit.concepts[index] ?? `${unitId} concept ${index}`,
          category: `M${mod.number}: ${mod.title}`,
        };
      }
    }
    return { entry, label: unitId, category: "Syllabus" };
  }

  if (id.startsWith("milestone:")) {
    const msId = id.slice("milestone:".length);
    for (const month of roadmap.months) {
      const ms = month.milestones.find((m) => m.id === msId);
      if (ms) return { entry, label: ms.text, category: "Milestone" };
    }
    return { entry, label: msId, category: "Milestone" };
  }

  if (id.startsWith("projectcheck:")) {
    const parts = id.split(":");
    const projectId = parts[1];
    const index = parseInt(parts[2], 10);
    const project = roadmap.projects.find((p) => p.id === projectId);
    if (project) {
      return {
        entry,
        label: project.checklist[index]?.text ?? projectId,
        category: "Project",
      };
    }
    return { entry, label: projectId, category: "Project" };
  }

  if (id.startsWith("resource:")) {
    const resId = id.slice("resource:".length);
    const res = roadmap.resources.find((r) => r.id === resId);
    return { entry, label: res?.title ?? resId, category: "Resource" };
  }

  if (id.startsWith("dsarow:")) {
    const index = parseInt(id.slice("dsarow:".length), 10);
    const row = roadmap.dsaTable[index];
    return { entry, label: row ? `${row.topic} (Wk ${row.weeks})` : id, category: "DSA" };
  }

  return { entry, label: id, category: "Other" };
}

export function buildCategoryDistribution(
  resolved: ResolvedActivity[]
): { name: string; value: number; color: string }[] {
  const counts: Record<string, number> = {};
  for (const r of resolved) {
    if (r.entry.action !== "completed") continue;
    counts[r.category] = (counts[r.category] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value, color: categoryColor(name) }));
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export function formatDuration(ms: number): string {
  if (ms < 60_000) return "< 1 min";
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

export interface TopicDuration {
  id: string;
  label: string;
  firstAt: string;
  lastAt: string;
  durationMs: number;
  completedCount: number;
  totalCount: number;
  type: "week" | "unit";
}

export function buildTopicDurations(
  activityLog: ActivityEntry[],
  roadmap: RoadmapData,
  syllabus: SyllabusData
): TopicDuration[] {
  // Group completion timestamps by weekId / unitId
  const weekTs: Record<string, string[]> = {};
  const unitTs: Record<string, string[]> = {};

  for (const entry of activityLog) {
    if (entry.action !== "completed") continue;
    if (entry.id.startsWith("task:")) {
      const parts = entry.id.split(":");
      const weekId = parts[1];
      (weekTs[weekId] ??= []).push(entry.timestamp);
    } else if (entry.id.startsWith("concept:")) {
      const parts = entry.id.split(":");
      const unitId = parts[1];
      (unitTs[unitId] ??= []).push(entry.timestamp);
    }
  }

  const results: TopicDuration[] = [];

  for (const month of roadmap.months) {
    for (const week of month.weeks) {
      const ts = weekTs[week.id];
      if (!ts || ts.length === 0) continue;
      const sorted = [...ts].sort();
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      results.push({
        id: week.id,
        label: `Month ${month.number} · Week ${week.number}`,
        firstAt: first,
        lastAt: last,
        durationMs: new Date(last).getTime() - new Date(first).getTime(),
        completedCount: ts.length,
        totalCount: week.tasks.length,
        type: "week",
      });
    }
  }

  for (const mod of syllabus.modules) {
    for (const unit of mod.units) {
      const ts = unitTs[unit.id];
      if (!ts || ts.length === 0) continue;
      const sorted = [...ts].sort();
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      results.push({
        id: unit.id,
        label: `${unit.id} ${unit.title}`,
        firstAt: first,
        lastAt: last,
        durationMs: new Date(last).getTime() - new Date(first).getTime(),
        completedCount: ts.length,
        totalCount: unit.concepts.length || 1,
        type: "unit",
      });
    }
  }

  return results.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function mostProductiveDay(activityLog: ActivityEntry[]): { date: string; count: number } | null {
  const counts: Record<string, number> = {};
  for (const entry of activityLog) {
    if (entry.action !== "completed") continue;
    const date = entry.timestamp.slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  const [date, count] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { date, count };
}
