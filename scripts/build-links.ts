import type { RoadmapData, SyllabusData, SmartLink } from "../src/types/content";

const STOPWORDS = new Set([
  "this","that","with","from","have","will","your","into","when","what","basics",
  "basic","concept","concepts","fundamental","fundamentals","overview","practical",
  "practice","understanding","using","start","review","cont","week","weeks","month",
  "advanced","core","introduction","intro","and","the","for","essential",
]);

function significantWords(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function normalizedTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

export function buildSmartLinks(roadmap: RoadmapData, syllabus: SyllabusData): SmartLink[] {
  const units = syllabus.modules.flatMap((m) => m.units);
  const unitKeyTerms = units.map((u) => ({
    unit: u,
    terms: Array.from(
      new Set([...significantWords(u.title), ...u.concepts.flatMap(significantWords)])
    ),
    titlePhrase: normalizedTitle(u.title),
  }));

  const links: SmartLink[] = [];

  for (const month of roadmap.months) {
    for (const week of month.weeks) {
      for (const task of week.tasks) {
        const taskLower = task.text.toLowerCase();
        let best: { unitId: string; moduleNumber: number; score: number; term: string } | null = null;

        for (const { unit, terms, titlePhrase } of unitKeyTerms) {
          let score = 0;
          let matchedTerm = "";
          if (titlePhrase.length >= 4 && taskLower.includes(titlePhrase)) {
            score += 3;
            matchedTerm = unit.title;
          }
          const matchedWords = terms.filter((t) => taskLower.includes(t));
          score += matchedWords.length;
          if (!matchedTerm && matchedWords.length > 0) {
            matchedTerm = matchedWords.sort((a, b) => b.length - a.length)[0];
          }
          const qualifies = score >= 2 || (score >= 1 && matchedTerm.length >= 7);
          if (qualifies && (!best || score > best.score)) {
            best = { unitId: unit.id, moduleNumber: unit.moduleNumber, score, term: matchedTerm };
          }
        }

        if (best) {
          links.push({
            weekId: week.id,
            monthId: month.id,
            taskText: task.text,
            unitId: best.unitId,
            moduleNumber: best.moduleNumber,
            score: best.score,
            matchedTerm: best.term,
          });
        }
      }
    }
  }

  return links;
}
