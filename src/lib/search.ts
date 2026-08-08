import { lessons, roadmap, syllabus } from "@/lib/data";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: string;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const month of roadmap.months) {
    items.push({
      id: month.id,
      title: `Month ${month.number} — ${month.title}`,
      subtitle: month.focus,
      href: `/roadmap/${month.id}`,
      group: "Roadmap",
    });
    for (const week of month.weeks) {
      items.push({
        id: week.id,
        title: `Week ${week.number}`,
        subtitle: week.tasks.map((t) => t.text).join(" · ").slice(0, 100),
        href: `/roadmap/${month.id}#${week.id}`,
        group: "Roadmap",
      });
    }
  }

  for (const mod of syllabus.modules) {
    items.push({
      id: mod.id,
      title: `Module ${mod.number} — ${mod.title}`,
      subtitle: mod.objective,
      href: `/syllabus/${mod.id}`,
      group: "Syllabus",
    });
    for (const unit of mod.units) {
      items.push({
        id: unit.id,
        title: `${unit.id} ${unit.title}`,
        subtitle: unit.concepts.join(", "),
        href: `/learn/${unit.id}`,
        group: "Syllabus",
      });
    }
  }

  for (const mod of syllabus.modules) {
    for (const unit of mod.units) {
      const md = lessons[unit.id as keyof typeof lessons];
      if (!md) continue;
      const headings = (md as string)
        .split("\n")
        .filter((line: string) => /^#{2,3}\s/.test(line))
        .map((line: string) => {
          const match = line.match(/^#{2,3}\s+(.+)$/);
          if (!match) return null;
          const text = match[1].replace(/[`*_[\]]/g, "").trim();
          return { text, id: slugify(text) };
        })
        .filter(Boolean) as { text: string; id: string }[];
      for (const h of headings) {
        items.push({
          id: `${unit.id}#${h.id}`,
          title: h.text,
          subtitle: `${unit.id} ${unit.title}`,
          href: `/learn/${unit.id}#${h.id}`,
          group: "Lessons",
        });
      }
    }
  }

  for (const project of roadmap.projects) {
    items.push({
      id: project.id,
      title: project.title,
      subtitle: project.description.slice(0, 100),
      href: `/projects#${project.id}`,
      group: "Projects",
    });
  }

  for (const resource of roadmap.resources) {
    items.push({
      id: resource.id,
      title: resource.title,
      subtitle: resource.category,
      href: `/resources#${resource.id}`,
      group: "Resources",
    });
  }

  return items;
}
