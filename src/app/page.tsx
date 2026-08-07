"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  CalendarDays,
  Code2,
  FolderGit2,
  ListChecks,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { roadmap, syllabus, totalConceptCount, totalDsaProblems } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import {
  currentModuleUnit,
  currentWeek,
  dsaProblemsSolved,
  monthProgress,
  overallCombinedProgress,
  overallRoadmapProgress,
  overallSyllabusProgress,
  taskId,
  weekProgress,
} from "@/lib/progress";
import { StatCard, Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { Checkbox } from "@/components/shared/Checkbox";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DashboardPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const streak = useStudyStore((s) => s.currentStreak());
  const dailyGoal = useStudyStore((s) => s.dailyGoalMinutes);
  const weeklyGoal = useStudyStore((s) => s.weeklyGoalMinutes);

  const combined = overallCombinedProgress(completed);
  const roadmapP = overallRoadmapProgress(completed);
  const syllabusP = overallSyllabusProgress(completed);

  const cw = currentWeek(completed);
  const cwProgress = cw ? weekProgress(cw.week, completed) : null;
  const cmu = currentModuleUnit(completed);

  const totalUnits = syllabus.modules.reduce((n, m) => n + m.units.length, 0);
  const totalModules = syllabus.modules.length;
  const totalConcepts = totalConceptCount();
  const totalProblems = totalDsaProblems();
  const solvedProblems = dsaProblemsSolved(completed);

  const remainingProjects = roadmap.projects.length;
  const nextMilestone = roadmap.months
    .flatMap((m) => m.milestones.map((ms) => ({ ...ms, month: m })))
    .find((ms) => !completed[`milestone:${ms.id}`]);

  const todayName = DAY_NAMES[new Date().getDay()];
  const todaysFocus = roadmap.weeklyTimeBudget?.rows.find((r) => r[0] === todayName.slice(0, 3));

  const resumeHref = cw ? `/roadmap/${cw.month.id}#${cw.week.id}` : "/roadmap";

  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden bg-linear-to-br from-accent/10 via-surface to-accent-2/10">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
              <Sparkles className="h-3.5 w-3.5" /> {roadmap.meta["Window"] ?? "6-month plan"}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{roadmap.title}</h1>
            <p className="mt-2 text-sm text-muted">{roadmap.subtitle}</p>
            <Link
              href={resumeHref}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:brightness-110 focus-ring"
            >
              Resume Studying <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing
              value={combined.pct}
              size={112}
              strokeWidth={9}
              label={
                <div className="text-center">
                  <div className="text-xl font-bold">{combined.pct}%</div>
                  <div className="text-[10px] text-muted">overall</div>
                </div>
              }
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Streak" value={`${streak}d`} icon={Trophy} accent="var(--accent-3)" />
        <StatCard label="Roadmap" value={`${roadmapP.pct}%`} icon={CalendarDays} hint={`${roadmapP.done}/${roadmapP.total} tasks`} />
        <StatCard label="Syllabus" value={`${syllabusP.pct}%`} icon={BookOpen} hint={`${syllabusP.done}/${syllabusP.total} concepts`} accent="var(--accent-2)" />
        <StatCard label="DSA Problems" value={`${solvedProblems}/${totalProblems}`} icon={Code2} />
        <StatCard label="Modules" value={totalModules} icon={Boxes} hint={`${totalUnits} units · ${totalConcepts} concepts`} />
        <StatCard label="Projects" value={remainingProjects} icon={FolderGit2} hint="across the roadmap" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h2 className="font-semibold">Today&apos;s Study Plan</h2>
          </div>
          {todaysFocus && (
            <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm">
              <span className="font-medium">{todayName}:</span> {todaysFocus[2]}{" "}
              <span className="text-muted">({todaysFocus[3]})</span>
            </div>
          )}

          {cw && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted">
                  Current — Month {cw.month.number}, Week {cw.week.number}
                </span>
                <Link href={`/roadmap/${cw.month.id}#${cw.week.id}`} className="text-xs text-accent hover:underline">
                  Open week
                </Link>
              </div>
              {cwProgress && (
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${cwProgress.pct}%` }} />
                  </div>
                  <span className="shrink-0 text-xs text-muted">{cwProgress.done}/{cwProgress.total} tasks</span>
                </div>
              )}
              <ul className="flex flex-col gap-2">
                {cw.week.tasks.map((task, i) => {
                  const id = taskId(cw.week.id, task.column, i);
                  return (
                    <li
                      key={id}
                      className="flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 text-sm"
                    >
                      <Checkbox checked={!!completed[id]} onChange={() => toggleCompleted(id)} />
                      <div>
                        <span className="mr-2 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                          {task.column}
                        </span>
                        {task.text}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {cmu && (
            <div className="mt-2 border-t border-border pt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <Brain className="h-4 w-4" /> Current syllabus unit
                </span>
                <Link href={`/learn/${cmu.unit.id}`} className="text-xs text-accent hover:underline">
                  Study unit
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
                <div className="text-sm font-medium">
                  {cmu.unit.id} {cmu.unit.title}
                </div>
                <div className="mt-1 text-xs text-muted">{cmu.unit.concepts.join(" · ")}</div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-accent" />
              <h2 className="font-semibold">Upcoming Milestone</h2>
            </div>
            {nextMilestone ? (
              <div>
                <div className="text-xs font-medium text-muted">Month {nextMilestone.month.number}</div>
                <p className="mt-1 text-sm">{nextMilestone.text}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">All milestones complete — nice work.</p>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">Goals</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Daily goal</span>
                <span className="font-medium">{dailyGoal} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Weekly goal</span>
                <span className="font-medium">{weeklyGoal} min</span>
              </div>
              <Link href="/settings" className="text-xs text-accent hover:underline">
                Adjust in settings →
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">Month Progress</h2>
            <div className="flex flex-col gap-2">
              {roadmap.months.map((m) => {
                const mp = monthProgress(m, completed);
                return (
                  <Link
                    key={m.id}
                    href={`/roadmap/${m.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-2"
                  >
                    <span className="w-14 shrink-0 text-xs text-muted">Month {m.number}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${mp.pct}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs font-medium">{mp.pct}%</span>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
