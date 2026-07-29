"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Flame, ListTodo, CalendarClock } from "lucide-react";
import { roadmap, syllabus } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import {
  monthProgress,
  moduleProgress,
  overallCombinedProgress,
  weekProgress,
  dsaProblemsSolved,
} from "@/lib/progress";
import { totalDsaProblems } from "@/lib/data";
import { Card, StatCard } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";

const PIE_COLORS = ["var(--accent)", "var(--accent-2)", "var(--accent-3)", "var(--danger)", "#8b8ba0"];

function StudyHeatmap({ dates }: { dates: string[] }) {
  const set = new Set(dates);
  const days: { iso: string; active: boolean }[] = [];
  const today = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ iso, active: set.has(iso) });
  }
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.iso}
              title={day.iso}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: day.active ? "var(--accent)" : "var(--border)" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const studyDates = useStudyStore((s) => s.studyDates);
  const streak = useStudyStore((s) => s.currentStreak());
  const totalFocusSessions = useStudyStore((s) => s.pomodoro.totalFocusSessions);
  const projectLinks = useStudyStore((s) => s.projectLinks);

  const combined = overallCombinedProgress(completed);

  const monthData = roadmap.months.map((m) => ({
    name: `M${m.number}`,
    pct: monthProgress(m, completed).pct,
  }));

  const weekData = roadmap.months.flatMap((m) =>
    m.weeks.map((w) => ({ name: `W${w.number}`, pct: weekProgress(w, completed).pct }))
  );

  const moduleData = syllabus.modules.map((m) => ({
    name: `M${m.number}`,
    pct: moduleProgress(m, completed).pct,
  }));

  const solved = dsaProblemsSolved(completed);
  const totalProblems = totalDsaProblems();

  const projectsDone = roadmap.projects.filter((p) => {
    const links = projectLinks[p.id];
    const checklistDone = p.checklist.every((c) => completed[c.id]);
    return checklistDone && (links?.demo || links?.github);
  }).length;
  const projectPie = [
    { name: "Complete", value: projectsDone },
    { name: "In progress", value: roadmap.projects.length - projectsDone },
  ];

  const daysActive = studyDates.length;
  const pacePerDay = daysActive > 0 ? combined.done / daysActive : 0;
  const remaining = combined.total - combined.done;
  const forecastDays = pacePerDay > 0 ? Math.ceil(remaining / pacePerDay) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted">A bird&apos;s-eye view of progress, pace, and what&apos;s left.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Overall Progress" value={`${combined.pct}%`} icon={TrendingUp} />
        <StatCard label="Streak" value={`${streak}d`} icon={Flame} accent="var(--accent-3)" />
        <StatCard label="Remaining Items" value={remaining} icon={ListTodo} />
        <StatCard
          label="Forecast"
          value={forecastDays ? `~${forecastDays}d` : "—"}
          icon={CalendarClock}
          hint="at your current pace"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-2 lg:col-span-1">
          <h2 className="self-start font-semibold">Overall Progress</h2>
          <ProgressRing value={combined.pct} size={140} strokeWidth={12} />
          <p className="text-xs text-muted">
            {combined.done} of {combined.total} tracked items complete
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Monthly Completion</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="pct" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Weekly Completion (24 weeks)</h2>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={1} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="pct" stroke="var(--accent-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Module Completion</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={moduleData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={30} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="pct" fill="var(--accent-3)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Projects</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={projectPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {projectPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 font-semibold">DSA Progress</h2>
          <p className="mb-4 text-xs text-muted">
            {solved} of {totalProblems} target problems solved
          </p>
          <div className="h-3 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${totalProblems ? Math.round((solved / totalProblems) * 100) : 0}%` }}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-semibold">Study Time (Pomodoro)</h2>
          <p className="text-2xl font-bold">{totalFocusSessions} sessions</p>
          <p className="text-xs text-muted">≈ {Math.round((totalFocusSessions * 25) / 60)} focus hours logged</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Learning Streak Heatmap</h2>
        <StudyHeatmap dates={studyDates} />
        <p className="mt-2 text-xs text-muted">{daysActive} active study days recorded, last 16 weeks shown</p>
      </Card>
    </div>
  );
}
