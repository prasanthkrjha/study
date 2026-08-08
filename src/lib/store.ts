"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export interface ActivityEntry {
  id: string;
  action: "completed" | "uncompleted";
  timestamp: string; // ISO 8601
}

interface Note {
  id: string;
  text: string;
  createdAt: string;
  targetId?: string;
  targetLabel?: string;
}

interface PomodoroState {
  isRunning: boolean;
  mode: "focus" | "break";
  secondsLeft: number;
  focusMinutes: number;
  breakMinutes: number;
  sessionsCompletedToday: number;
  lastSessionDate: string | null;
  totalFocusSessions: number;
}

interface StudyStore {
  // completion tracking — generic string ids so it works for any parsed item
  completedIds: Record<string, boolean>;
  toggleCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;

  // bookmarks
  bookmarkedIds: Record<string, { label: string; href: string }>;
  toggleBookmark: (id: string, label: string, href: string) => void;
  isBookmarked: (id: string) => boolean;

  // notes
  notes: Note[];
  addNote: (text: string, targetId?: string, targetLabel?: string) => void;
  removeNote: (id: string) => void;

  // theme
  theme: Theme;
  setTheme: (t: Theme) => void;

  // streak
  studyDates: string[]; // ISO yyyy-mm-dd, one entry per active day
  recordStudyToday: () => void;
  currentStreak: () => number;

  // daily/weekly goals
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
  setDailyGoalMinutes: (n: number) => void;
  setWeeklyGoalMinutes: (n: number) => void;

  // pomodoro
  pomodoro: PomodoroState;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  setPomodoroLengths: (focusMinutes: number, breakMinutes: number) => void;

  // command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // per-project external links, editable by the user
  projectLinks: Record<string, { demo?: string; github?: string }>;
  setProjectLink: (projectId: string, field: "demo" | "github", value: string) => void;

  // activity log — one entry per toggle, newest last
  activityLog: ActivityEntry[];

  // DSA problem tracking — per-problem completion + optional notes
  dsaProblemStatus: Record<string, { completed: boolean; notes: string }>;
  toggleDsaProblem: (id: string) => void;
  setDsaProblemNote: (id: string, notes: string) => void;

  resetProgress: () => void;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      completedIds: {},
      toggleCompleted: (id) => {
        set((s) => {
          const wasCompleted = !!s.completedIds[id];
          return {
            completedIds: { ...s.completedIds, [id]: !wasCompleted },
            activityLog: [
              ...s.activityLog,
              { id, action: wasCompleted ? "uncompleted" : "completed", timestamp: new Date().toISOString() },
            ],
          };
        });
        get().recordStudyToday();
      },
      isCompleted: (id) => !!get().completedIds[id],

      bookmarkedIds: {},
      toggleBookmark: (id, label, href) =>
        set((s) => {
          const next = { ...s.bookmarkedIds };
          if (next[id]) delete next[id];
          else next[id] = { label, href };
          return { bookmarkedIds: next };
        }),
      isBookmarked: (id) => !!get().bookmarkedIds[id],

      notes: [],
      addNote: (text, targetId, targetLabel) =>
        set((s) => ({
          notes: [
            { id: crypto.randomUUID(), text, createdAt: new Date().toISOString(), targetId, targetLabel },
            ...s.notes,
          ],
        })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      theme: "system",
      setTheme: (t) => set({ theme: t }),

      studyDates: [],
      recordStudyToday: () =>
        set((s) => (s.studyDates.includes(todayIso()) ? s : { studyDates: [...s.studyDates, todayIso()] })),
      currentStreak: () => {
        const dates = new Set(get().studyDates);
        let streak = 0;
        const cursor = new Date();
        while (true) {
          const iso = cursor.toISOString().slice(0, 10);
          if (dates.has(iso)) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
          } else if (iso === todayIso()) {
            cursor.setDate(cursor.getDate() - 1);
          } else {
            break;
          }
        }
        return streak;
      },

      dailyGoalMinutes: 120,
      weeklyGoalMinutes: 900,
      setDailyGoalMinutes: (n) => set({ dailyGoalMinutes: n }),
      setWeeklyGoalMinutes: (n) => set({ weeklyGoalMinutes: n }),

      pomodoro: {
        isRunning: false,
        mode: "focus",
        secondsLeft: 60 * 60,
        focusMinutes: 60,
        breakMinutes: 5,
        sessionsCompletedToday: 0,
        lastSessionDate: null,
        totalFocusSessions: 0,
      },
      startPomodoro: () => set((s) => ({ pomodoro: { ...s.pomodoro, isRunning: true } })),
      pausePomodoro: () => set((s) => ({ pomodoro: { ...s.pomodoro, isRunning: false } })),
      resetPomodoro: () =>
        set((s) => ({
          pomodoro: {
            ...s.pomodoro,
            isRunning: false,
            mode: "focus",
            secondsLeft: s.pomodoro.focusMinutes * 60,
          },
        })),
      tickPomodoro: () =>
        set((s) => {
          if (!s.pomodoro.isRunning) return s;
          if (s.pomodoro.secondsLeft > 1) {
            return { pomodoro: { ...s.pomodoro, secondsLeft: s.pomodoro.secondsLeft - 1 } };
          }
          const finishedFocus = s.pomodoro.mode === "focus";
          const today = todayIso();
          return {
            pomodoro: {
              ...s.pomodoro,
              mode: finishedFocus ? "break" : "focus",
              secondsLeft: finishedFocus ? s.pomodoro.breakMinutes * 60 : s.pomodoro.focusMinutes * 60,
              sessionsCompletedToday:
                finishedFocus
                  ? s.pomodoro.lastSessionDate === today
                    ? s.pomodoro.sessionsCompletedToday + 1
                    : 1
                  : s.pomodoro.sessionsCompletedToday,
              lastSessionDate: finishedFocus ? today : s.pomodoro.lastSessionDate,
              totalFocusSessions: finishedFocus
                ? s.pomodoro.totalFocusSessions + 1
                : s.pomodoro.totalFocusSessions,
            },
          };
        }),
      setPomodoroLengths: (focusMinutes, breakMinutes) =>
        set((s) => ({
          pomodoro: {
            ...s.pomodoro,
            focusMinutes,
            breakMinutes,
            secondsLeft: s.pomodoro.mode === "focus" ? focusMinutes * 60 : breakMinutes * 60,
          },
        })),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      projectLinks: {},
      setProjectLink: (projectId, field, value) =>
        set((s) => ({
          projectLinks: {
            ...s.projectLinks,
            [projectId]: { ...s.projectLinks[projectId], [field]: value },
          },
        })),

      activityLog: [],

      dsaProblemStatus: {},
      toggleDsaProblem: (id) =>
        set((s) => ({
          dsaProblemStatus: {
            ...s.dsaProblemStatus,
            [id]: {
              completed: !s.dsaProblemStatus[id]?.completed,
              notes: s.dsaProblemStatus[id]?.notes ?? "",
            },
          },
        })),
      setDsaProblemNote: (id, notes) =>
        set((s) => ({
          dsaProblemStatus: {
            ...s.dsaProblemStatus,
            [id]: { completed: s.dsaProblemStatus[id]?.completed ?? false, notes },
          },
        })),

      resetProgress: () =>
        set({
          completedIds: {},
          studyDates: [],
          activityLog: [],
          dsaProblemStatus: {},
          pomodoro: {
            isRunning: false,
            mode: "focus",
            secondsLeft: 60 * 60,
            focusMinutes: 60,
            breakMinutes: 5,
            sessionsCompletedToday: 0,
            lastSessionDate: null,
            totalFocusSessions: 0,
          },
        }),
    }),
    { name: "studyos-store", skipHydration: true }
  )
);

/** The persisted store must not hydrate until after the client's first
 * render, or the SSR-rendered HTML (which has no localStorage) will
 * mismatch the client's rehydrated state. Call this once from a
 * top-level client component's effect. */
export function rehydrateStudyStore() {
  useStudyStore.persist.rehydrate();
}
