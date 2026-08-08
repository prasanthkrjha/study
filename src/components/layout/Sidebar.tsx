"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  FolderGit2,
  Library,
  Code2,
  MessagesSquare,
  BarChart3,
  Activity,
  Bookmark,
  StickyNote,
  Settings,
  ChevronDown,
  GraduationCap,
  Zap,
} from "lucide-react";
import { roadmap, syllabus } from "@/lib/data";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    {
      label: "Roadmap",
      href: "/roadmap",
      icon: Map,
      children: roadmap.months.map((m) => ({
        label: `Month ${m.number} — ${m.title}`,
        href: `/roadmap/${m.id}`,
      })),
    },
    {
      label: "Syllabus",
      href: "/syllabus",
      icon: BookOpen,
      children: syllabus.modules.map((m) => ({
        label: `Module ${m.number} — ${m.title}`,
        href: `/syllabus/${m.id}`,
      })),
    },
    { label: "Projects", href: "/projects", icon: FolderGit2 },
    { label: "Resources", href: "/resources", icon: Library },
    { label: "DSA Tracker", href: "/dsa", icon: Code2 },
    { label: "Flashcard Quiz", href: "/quiz", icon: Zap },
    { label: "Interview Prep", href: "/interview", icon: MessagesSquare },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Activity", href: "/activity", icon: Activity },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "Notes", href: "/notes", icon: StickyNote },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Roadmap: pathname.startsWith("/roadmap"),
    Syllabus: pathname.startsWith("/syllabus"),
  });

  return (
    <nav className="flex h-full w-72 flex-col gap-1 overflow-y-auto border-r border-border bg-surface px-3 py-4">
      <Link
        href="/"
        onClick={onNavigate}
        className="mb-4 flex items-center gap-2 px-2 py-1.5 text-lg font-bold tracking-tight"
      >
        <GraduationCap className="h-6 w-6 text-accent" />
        <span className="gradient-text">StudyOS</span>
      </Link>

      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const isOpen = openSections[item.label];

        return (
          <div key={item.href}>
            <div
              className={cn(
                "flex items-center gap-1 rounded-lg text-sm",
                active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex flex-1 items-center gap-2.5 px-3 py-2 focus-ring rounded-lg"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
              {item.children && (
                <button
                  onClick={() => setOpenSections((s) => ({ ...s, [item.label]: !s[item.label] }))}
                  className="mr-1 rounded p-1 hover:bg-surface-2 focus-ring"
                  aria-label={`Toggle ${item.label} submenu`}
                >
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                </button>
              )}
            </div>
            {item.children && isOpen && (
              <div className="ml-6 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "truncate rounded-md px-2 py-1.5 text-xs focus-ring",
                        childActive
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-muted hover:bg-surface-2 hover:text-foreground"
                      )}
                      title={child.label}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
