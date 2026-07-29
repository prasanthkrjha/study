"use client";

import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/lib/store";
import { buildSearchIndex } from "@/lib/search";
import { Search } from "lucide-react";

export function CommandPalette() {
  const open = useStudyStore((s) => s.commandPaletteOpen);
  const setOpen = useStudyStore((s) => s.setCommandPaletteOpen);
  const router = useRouter();
  const items = useMemo(() => buildSearchIndex(), []);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  if (!open) return null;

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-float-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Command shouldFilter loop>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search months, modules, units, projects, resources…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">Esc</kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
              No results found.
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted"
              >
                {items
                  .filter((i) => i.group === group)
                  .map((i) => (
                    <Command.Item
                      key={i.id + i.href}
                      value={`${i.title} ${i.subtitle ?? ""}`}
                      onSelect={() => {
                        setOpen(false);
                        setQuery("");
                        router.push(i.href);
                      }}
                      className="cursor-pointer rounded-lg px-3 py-2 text-sm data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
                    >
                      <div className="font-medium">{i.title}</div>
                      {i.subtitle && (
                        <div className="truncate text-xs text-muted">{i.subtitle}</div>
                      )}
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
