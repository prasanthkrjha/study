"use client";

import { Search, Sun, Moon, Laptop, Flame, Menu } from "lucide-react";
import { useStudyStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const setOpen = useStudyStore((s) => s.setCommandPaletteOpen);
  const theme = useStudyStore((s) => s.theme);
  const setTheme = useStudyStore((s) => s.setTheme);
  const streak = useStudyStore((s) => s.currentStreak());

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Laptop,
  } as const;

  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-surface-2 focus-ring lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={() => setOpen(true)}
        className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted hover:border-accent/40 focus-ring"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search everything…</span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium"
          title="Current study streak"
        >
          <Flame className={cn("h-4 w-4", streak > 0 ? "text-accent-3" : "text-muted")} />
          {streak}
        </div>

        <div className="flex items-center rounded-lg border border-border bg-surface p-1">
          {(["light", "dark", "system"] as const).map((t) => {
            const Icon = themeIcons[t];
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded-md p-1.5 focus-ring",
                  theme === t ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
                )}
                aria-label={`${t} theme`}
                title={`${t} theme`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
