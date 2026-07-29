"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Timer, X } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PomodoroWidget() {
  const [collapsed, setCollapsed] = useState(true);
  const pomodoro = useStudyStore((s) => s.pomodoro);
  const start = useStudyStore((s) => s.startPomodoro);
  const pause = useStudyStore((s) => s.pausePomodoro);
  const reset = useStudyStore((s) => s.resetPomodoro);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 hover:brightness-110"
      >
        <Timer className="h-4 w-4" />
        {pomodoro.isRunning ? formatTime(pomodoro.secondsLeft) : "Focus"}
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-20 w-64 rounded-2xl border border-border bg-surface p-4 shadow-2xl animate-float-in">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          <Timer className="h-3.5 w-3.5" /> {pomodoro.mode === "focus" ? "Focus" : "Break"}
        </span>
        <button onClick={() => setCollapsed(true)} className="rounded p-1 hover:bg-surface-2">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mb-3 text-center text-4xl font-bold tabular-nums">{formatTime(pomodoro.secondsLeft)}</div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={pomodoro.isRunning ? pause : start}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white",
            pomodoro.isRunning ? "bg-accent-3" : "bg-accent"
          )}
        >
          {pomodoro.isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {pomodoro.isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-2"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
      <div className="mt-3 text-center text-[11px] text-muted">
        {pomodoro.sessionsCompletedToday} focus session{pomodoro.sessionsCompletedToday === 1 ? "" : "s"} today
      </div>
    </div>
  );
}
