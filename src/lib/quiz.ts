import { lessons, syllabus } from "@/lib/data";

export interface QuizQuestion {
  id: string;
  unitId: string;
  unitTitle: string;
  moduleNumber: number;
  moduleTitle: string;
  question: string;
  answer: string;
}

function extractQAs(unitId: string, markdown: string): { question: string; answer: string }[] {
  const lines = markdown.split("\n");
  const qas: { question: string; answer: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match **Q1: text** or **Q: text** or **Q: "text"**
    const qMatch = line.match(/^\*\*Q\d*:?\s*"?(.+?)"?\*\*\s*$/);
    if (!qMatch) continue;

    // Find next non-empty line for answer
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;

    const aLine = lines[j];
    const aMatch = aLine?.match(/^A:\s*(.+)/);
    if (!aMatch) continue;

    // Collect single-paragraph answer (stop at blank line or next question)
    const answerParts = [aMatch[1].trim()];
    let k = j + 1;
    while (k < lines.length && lines[k].trim() !== "" && !lines[k].match(/^\*\*Q/)) {
      answerParts.push(lines[k].trim());
      k++;
    }

    qas.push({ question: qMatch[1], answer: answerParts.join(" ") });
    i = k - 1;
  }

  return qas;
}

export function buildQuizIndex(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const mod of syllabus.modules) {
    for (const unit of mod.units) {
      const md = lessons[unit.id as keyof typeof lessons] as string | undefined;
      if (!md) continue;
      const qas = extractQAs(unit.id, md);
      for (let i = 0; i < qas.length; i++) {
        questions.push({
          id: `${unit.id}:q${i}`,
          unitId: unit.id,
          unitTitle: unit.title,
          moduleNumber: mod.number,
          moduleTitle: mod.title,
          question: qas[i].question,
          answer: qas[i].answer,
        });
      }
    }
  }

  return questions;
}
