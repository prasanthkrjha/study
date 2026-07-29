import type { Month, Module, Unit, Week } from "@/types/content";
import { roadmap, syllabus } from "@/lib/data";

export type CompletedMap = Record<string, boolean>;

export function taskId(weekId: string, column: string, index: number) {
  return `task:${weekId}:${column}:${index}`;
}

export function conceptId(unitId: string, index: number) {
  return `concept:${unitId}:${index}`;
}

export function milestoneId(id: string) {
  return `milestone:${id}`;
}

export function resourceId(id: string) {
  return `resource:${id}`;
}

export function projectChecklistId(projectId: string, index: number) {
  return `projectcheck:${projectId}:${index}`;
}

export function dsaRowId(index: number) {
  return `dsarow:${index}`;
}

function ratio(done: number, total: number) {
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function weekProgress(week: Week, completed: CompletedMap) {
  const total = week.tasks.length;
  const done = week.tasks.filter((_, i) => completed[taskId(week.id, week.tasks[i].column, i)]).length;
  return ratio(done, total);
}

export function monthProgress(month: Month, completed: CompletedMap) {
  let total = 0;
  let done = 0;
  for (const week of month.weeks) {
    for (let i = 0; i < week.tasks.length; i++) {
      total++;
      if (completed[taskId(week.id, week.tasks[i].column, i)]) done++;
    }
  }
  return ratio(done, total);
}

export function unitProgress(unit: Unit, completed: CompletedMap) {
  const total = Math.max(unit.concepts.length, 1);
  const done = unit.concepts.length
    ? unit.concepts.filter((_, i) => completed[conceptId(unit.id, i)]).length
    : completed[conceptId(unit.id, 0)]
      ? 1
      : 0;
  return ratio(done, total);
}

export function moduleProgress(mod: Module, completed: CompletedMap) {
  let total = 0;
  let done = 0;
  for (const unit of mod.units) {
    const up = unitProgress(unit, completed);
    total += up.total;
    done += up.done;
  }
  return ratio(done, total);
}

export function overallRoadmapProgress(completed: CompletedMap) {
  let total = 0;
  let done = 0;
  for (const month of roadmap.months) {
    const mp = monthProgress(month, completed);
    total += mp.total;
    done += mp.done;
  }
  return ratio(done, total);
}

export function overallSyllabusProgress(completed: CompletedMap) {
  let total = 0;
  let done = 0;
  for (const mod of syllabus.modules) {
    const mp = moduleProgress(mod, completed);
    total += mp.total;
    done += mp.done;
  }
  return ratio(done, total);
}

export function overallCombinedProgress(completed: CompletedMap) {
  const r = overallRoadmapProgress(completed);
  const s = overallSyllabusProgress(completed);
  return ratio(r.done + s.done, r.total + s.total);
}

/** Finds the first incomplete week (lowest number) as "current". Falls back
 * to the last week if everything is complete. */
export function currentWeek(completed: CompletedMap): { month: Month; week: Week } | null {
  for (const month of roadmap.months) {
    for (const week of month.weeks) {
      const wp = weekProgress(week, completed);
      if (wp.done < wp.total) return { month, week };
    }
  }
  const lastMonth = roadmap.months[roadmap.months.length - 1];
  const lastWeek = lastMonth?.weeks[lastMonth.weeks.length - 1];
  return lastMonth && lastWeek ? { month: lastMonth, week: lastWeek } : null;
}

export function currentModuleUnit(completed: CompletedMap): { module: Module; unit: Unit } | null {
  for (const mod of syllabus.modules) {
    for (const unit of mod.units) {
      const up = unitProgress(unit, completed);
      if (up.done < up.total) return { module: mod, unit };
    }
  }
  const lastModule = syllabus.modules[syllabus.modules.length - 1];
  const lastUnit = lastModule?.units[lastModule.units.length - 1];
  return lastModule && lastUnit ? { module: lastModule, unit: lastUnit } : null;
}

export function dsaWeekRange(weeksStr: string): [number, number] {
  const nums = (weeksStr.match(/\d+/g) ?? ["0"]).map(Number);
  return [nums[0], nums[nums.length - 1] ?? nums[0]];
}

export interface DsaTopicStats {
  start: number;
  end: number;
  target: number;
  solved: number;
  pct: number;
}

export function dsaTopicStats(weeksStr: string, fallbackTarget: string, completed: CompletedMap): DsaTopicStats {
  const [start, end] = dsaWeekRange(weeksStr);
  let target = 0;
  let solved = 0;
  for (const month of roadmap.months) {
    for (const week of month.weeks) {
      if (week.number < start || week.number > end) continue;
      week.tasks.forEach((task, i) => {
        if (task.column !== "DSA" || !task.problems) return;
        target += task.problems;
        if (completed[taskId(week.id, task.column, i)]) solved += task.problems;
      });
    }
  }
  if (target === 0) {
    const m = fallbackTarget.match(/\d+/g);
    target = m ? parseInt(m[m.length - 1], 10) : 0;
  }
  return { start, end, target, solved, pct: target === 0 ? 0 : Math.round((solved / target) * 100) };
}

export function dsaProblemsSolved(completed: CompletedMap) {
  let solved = 0;
  roadmap.months.forEach((month) => {
    month.weeks.forEach((week) => {
      week.tasks.forEach((task, i) => {
        if (task.problems && completed[taskId(week.id, task.column, i)]) {
          solved += task.problems;
        }
      });
    });
  });
  return solved;
}
