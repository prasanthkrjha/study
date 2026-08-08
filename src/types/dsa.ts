export type Difficulty = "Easy" | "Medium" | "Hard";

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  pattern: string;
  leetcodeUrl: string;
  hackerrankUrl?: string;
}

export interface DsaTopic {
  unitId: string; // matches syllabus unit id e.g. "1.2"
  title: string;
  description: string;
  problems: DsaProblem[];
}
