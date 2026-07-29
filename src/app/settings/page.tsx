"use client";

import { useState } from "react";
import { Download, Upload, RotateCcw, Moon, Sun, Laptop } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { Card } from "@/components/shared/Card";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const theme = useStudyStore((s) => s.theme);
  const setTheme = useStudyStore((s) => s.setTheme);
  const dailyGoal = useStudyStore((s) => s.dailyGoalMinutes);
  const weeklyGoal = useStudyStore((s) => s.weeklyGoalMinutes);
  const setDailyGoalMinutes = useStudyStore((s) => s.setDailyGoalMinutes);
  const setWeeklyGoalMinutes = useStudyStore((s) => s.setWeeklyGoalMinutes);
  const pomodoro = useStudyStore((s) => s.pomodoro);
  const setPomodoroLengths = useStudyStore((s) => s.setPomodoroLengths);
  const resetProgress = useStudyStore((s) => s.resetProgress);
  const [resetConfirm, setResetConfirm] = useState(false);

  function exportData() {
    const raw = localStorage.getItem("studyos-store");
    if (!raw) return;
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studyos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        JSON.parse(reader.result as string); // validate
        localStorage.setItem("studyos-store", reader.result as string);
        window.location.reload();
      } catch {
        alert("That file doesn't look like a valid StudyOS backup.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">Preferences, goals, and local data management.</p>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Appearance</h2>
        <div className="flex gap-2">
          {(
            [
              { key: "light", icon: Sun },
              { key: "dark", icon: Moon },
              { key: "system", icon: Laptop },
            ] as const
          ).map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm capitalize",
                theme === key ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-surface-2"
              )}
            >
              <Icon className="h-4 w-4" /> {key}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Study Goals</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            Daily goal (minutes)
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Weekly goal (minutes)
            <input
              type="number"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoalMinutes(Number(e.target.value))}
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none"
            />
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Pomodoro Timer</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            Focus length (minutes)
            <input
              type="number"
              value={pomodoro.focusMinutes}
              onChange={(e) => setPomodoroLengths(Number(e.target.value), pomodoro.breakMinutes)}
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Break length (minutes)
            <input
              type="number"
              value={pomodoro.breakMinutes}
              onChange={(e) => setPomodoroLengths(pomodoro.focusMinutes, Number(e.target.value))}
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none"
            />
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Data Management</h2>
        <p className="mb-4 text-xs text-muted">
          All progress lives in this browser&apos;s local storage. Export a backup before clearing site data.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportData}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2"
          >
            <Download className="h-4 w-4" /> Export backup
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2">
            <Upload className="h-4 w-4" /> Import backup
            <input type="file" accept="application/json" onChange={importData} className="hidden" />
          </label>
          <button
            onClick={() => {
              if (resetConfirm) {
                resetProgress();
                setResetConfirm(false);
              } else {
                setResetConfirm(true);
                setTimeout(() => setResetConfirm(false), 4000);
              }
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm",
              resetConfirm
                ? "border-danger bg-danger/10 text-danger"
                : "border-border text-danger hover:bg-danger/10"
            )}
          >
            <RotateCcw className="h-4 w-4" /> {resetConfirm ? "Click again to confirm" : "Reset all progress"}
          </button>
        </div>
      </Card>
    </div>
  );
}
