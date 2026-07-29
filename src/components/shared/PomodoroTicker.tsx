"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/lib/store";

/** Mounted once near the root — advances the Pomodoro timer every second
 * regardless of which page is active. */
export function PomodoroTicker() {
  const isRunning = useStudyStore((s) => s.pomodoro.isRunning);
  const tick = useStudyStore((s) => s.tickPomodoro);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  return null;
}
