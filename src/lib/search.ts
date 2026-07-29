import { roadmap, syllabus } from "@/lib/data";

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
        href: `/syllabus/${mod.id}#unit-${unit.id.replace(".", "-")}`,
        group: "Syllabus",
      });
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
