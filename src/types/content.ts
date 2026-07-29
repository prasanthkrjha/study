// Structured content model produced by the markdown parser.
// Nothing about months/weeks/modules/units is hardcoded — these shapes
// are filled in dynamically from whatever headings/tables/lists exist
// in content/roadmap.md and content/syllabus.md.

export type Tier = "essential" | "recommended" | "optional" | "unknown";

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface WeekTask {
  column: string; // the table header this task came from, e.g. "DSA", "Full-Stack", "AI/Python"
  text: string;
  estimatedHours?: number;
  difficulty?: "easy" | "medium" | "hard";
  problems?: number;
}

export interface Week {
  id: string; // e.g. "week-1"
  number: number;
  tasks: WeekTask[];
}

export interface Month {
  id: string; // e.g. "month-1"
  number: number;
  title: string;
  focus?: string;
  weeks: Week[];
  projectText?: string;
  milestones: ChecklistItem[];
  raw: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  category: string;
  format?: string;
  tier: Tier;
}

export interface ProjectItem {
  id: string;
  title: string;
  month?: string;
  description: string;
  isFlagship: boolean;
  checklist: ChecklistItem[];
}

export interface DsaRow {
  weeks: string;
  topic: string;
  problems: string;
  cumulative: string;
}

export interface PriorityTier {
  tier: string;
  items: string[];
}

export interface RoadmapSection {
  id: string;
  title: string;
  level: number;
  contentMarkdown: string;
}

export interface RoadmapData {
  title: string;
  subtitle: string;
  meta: Record<string, string>;
  toc: { title: string; children: string[] }[];
  months: Month[];
  dsaTable: DsaRow[];
  projects: ProjectItem[];
  resources: ResourceItem[];
  priorityOrder: PriorityTier[];
  appendixChecklist: ChecklistItem[];
  sections: RoadmapSection[];
  weeklyTimeBudget: TableData | null;
}

export interface PracticeLink {
  label: string;
  url: string;
}

export interface Unit {
  id: string; // e.g. "1.2"
  moduleNumber: number;
  title: string;
  concepts: string[];
  primaryResource?: string;
  secondaryResource?: string;
  doneCriteria?: string;
  tier: Tier;
  practiceLinks: PracticeLink[];
  raw: string;
}

export interface Module {
  id: string; // e.g. "module-1"
  number: number;
  title: string;
  tier: Tier;
  objective?: string;
  units: Unit[];
  roughHours?: string;
  raw: string;
}

export interface SyllabusData {
  title: string;
  subtitle: string;
  curriculumMap: TableData | null;
  modules: Module[];
  appendixChecklist: { moduleTitle: string; items: ChecklistItem[] }[];
  sections: RoadmapSection[];
}

export interface SmartLink {
  weekId: string;
  monthId: string;
  taskText: string;
  unitId: string;
  moduleNumber: number;
  score: number;
  matchedTerm: string;
}

export interface StudyData {
  roadmap: RoadmapData;
  syllabus: SyllabusData;
  links: SmartLink[];
  lessons: Record<string, string>;
  generatedAt: string;
}
