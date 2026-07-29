import raw from "@/data/study-data.json";
import type { StudyData } from "@/types/content";

export const studyData = raw as unknown as StudyData;

export const { roadmap, syllabus, links, lessons } = studyData;

export function getLesson(unitId: string): string | undefined {
  return lessons[unitId];
}

export function allUnits() {
  return syllabus.modules.flatMap((m) => m.units);
}

export function unitById(id: string) {
  return allUnits().find((u) => u.id === id);
}

export function moduleByNumber(n: number) {
  return syllabus.modules.find((m) => m.number === n);
}

export function monthById(id: string) {
  return roadmap.months.find((m) => m.id === id);
}

export function weekById(id: string) {
  for (const month of roadmap.months) {
    const week = month.weeks.find((w) => w.id === id);
    if (week) return { week, month };
  }
  return null;
}

export function linksForWeek(weekId: string) {
  return links.filter((l) => l.weekId === weekId);
}

export function linkForTask(weekId: string, taskText: string) {
  return links.find((l) => l.weekId === weekId && l.taskText === taskText);
}

export function moduleIdForNumber(n: number) {
  return `module-${n}`;
}

export function linksForUnit(unitId: string) {
  return links.filter((l) => l.unitId === unitId);
}

export function totalTaskCount() {
  return roadmap.months.reduce(
    (sum, m) => sum + m.weeks.reduce((s, w) => s + w.tasks.length, 0),
    0
  );
}

export function totalUnitCount() {
  return allUnits().length;
}

export function totalConceptCount() {
  return allUnits().reduce((sum, u) => sum + u.concepts.length, 0);
}

export function totalDsaProblems() {
  const last = roadmap.dsaTable[roadmap.dsaTable.length - 1];
  if (!last) return 0;
  const m = /(\d+)/.exec(last.cumulative.replace(/[~–-].*$/, "").trim());
  const m2 = /(\d+)(?!.*\d)/.exec(last.cumulative);
  return m2 ? parseInt(m2[0], 10) : m ? parseInt(m[1], 10) : 0;
}

export function taskUid(monthId: string, weekId: string, column: string, text: string) {
  return `${monthId}:${weekId}:${column}:${text}`.slice(0, 300);
}
