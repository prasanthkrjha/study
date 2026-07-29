"use client";

import { useState } from "react";
import { ExternalLink, GitBranch, Rocket, Star } from "lucide-react";
import { roadmap } from "@/lib/data";
import { useStudyStore } from "@/lib/store";
import { Card } from "@/components/shared/Card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { Checkbox } from "@/components/shared/Checkbox";
import { cn } from "@/lib/utils";

function LinkField({
  icon: Icon,
  placeholder,
  value,
  onSave,
}: {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value?: string;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(draft);
          setEditing(false);
        }}
        className="flex flex-1 items-center gap-1"
      >
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onSave(draft);
            setEditing(false);
          }}
          placeholder={placeholder}
          className="w-full rounded-md border border-border bg-surface-2 px-2 py-1 text-xs outline-none"
        />
      </form>
    );
  }

  if (value) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon className="h-3.5 w-3.5" /> {placeholder} <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      className="flex items-center gap-1 text-xs text-muted hover:text-accent"
    >
      <Icon className="h-3.5 w-3.5" /> Add {placeholder.toLowerCase()}
    </button>
  );
}

export default function ProjectsPage() {
  const completed = useStudyStore((s) => s.completedIds);
  const toggleCompleted = useStudyStore((s) => s.toggleCompleted);
  const projectLinks = useStudyStore((s) => s.projectLinks);
  const setProjectLink = useStudyStore((s) => s.setProjectLink);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Portfolio Tracker</h1>
        <p className="mt-1 text-sm text-muted">
          {roadmap.projects.length} projects mapped across the 6-month roadmap, from Part 5.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {roadmap.projects.map((project) => {
          const done = project.checklist.filter((c) => completed[c.id]).length;
          const total = project.checklist.length || 1;
          const pct = Math.round((done / total) * 100);
          const links = projectLinks[project.id] ?? {};

          return (
            <Card key={project.id} id={project.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {project.isFlagship && (
                      <span className="flex items-center gap-1 rounded-full bg-accent-3/15 px-2 py-0.5 text-[10px] font-medium text-accent-3">
                        <Star className="h-3 w-3 fill-current" /> Flagship
                      </span>
                    )}
                    {project.month && (
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Month {project.month}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold leading-snug">{project.title}</h2>
                </div>
                <ProgressRing value={pct} size={48} strokeWidth={4} />
              </div>

              <p className="text-sm text-muted">{project.description}</p>

              {project.checklist.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                  {project.checklist.map((item) => (
                    <label key={item.id} className="flex items-start gap-2.5 text-sm">
                      <Checkbox checked={!!completed[item.id]} onChange={() => toggleCompleted(item.id)} size={16} />
                      <span className={cn("capitalize-first", completed[item.id] && "text-muted line-through")}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 border-t border-border pt-3">
                <LinkField
                  icon={Rocket}
                  placeholder="Live Demo"
                  value={links.demo}
                  onSave={(v) => setProjectLink(project.id, "demo", v)}
                />
                <LinkField
                  icon={GitBranch}
                  placeholder="GitHub"
                  value={links.github}
                  onSave={(v) => setProjectLink(project.id, "github", v)}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
