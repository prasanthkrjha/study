import {
  parseMd,
  textOf,
  tableToData,
  findTables,
  listToChecklist,
  slugify,
  boldLabelFromParagraph,
} from "./lib/md";
import { sectionsAtDepth, headingsWithOffsets } from "./lib/sections";
import type {
  SyllabusData,
  Module,
  Unit,
  Tier,
  ChecklistItem,
  RoadmapSection,
  PracticeLink,
} from "../src/types/content";

export type PracticeLinksMap = Record<string, PracticeLink[]>;
import type { Content } from "mdast";

function tierFromEmoji(text: string): Tier {
  if (text.includes("🔴")) return "essential";
  if (text.includes("🟡")) return "recommended";
  if (text.includes("🟢")) return "optional";
  return "unknown";
}

function tierFromText(text: string): Tier {
  const t = text.toLowerCase();
  if (t.includes("essential") || text.includes("🔴")) return "essential";
  if (t.includes("recommend") || text.includes("🟡")) return "recommended";
  if (t.includes("option") || text.includes("🟢")) return "optional";
  return "unknown";
}

function parseCurriculumMap(markdown: string) {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /curriculum map/i.test(s.title)
  );
  if (!section) return null;
  const root = parseMd(section.raw);
  const tables = findTables(root.children);
  if (tables.length === 0) return null;
  return tableToData(tables[0]);
}

function parseUnitsFromModule(
  moduleRaw: string,
  moduleNumber: number,
  moduleTier: Tier,
  practiceLinks: PracticeLinksMap
): Unit[] {
  const root = parseMd(moduleRaw);
  const tables = findTables(root.children);
  const units: Unit[] = [];

  for (const table of tables) {
    const { headers, rows } = tableToData(table);
    const idx = (pattern: RegExp) => headers.findIndex((h) => pattern.test(h));
    const unitIdx = idx(/^unit$/i);
    const conceptsIdx = idx(/concept/i);
    const primaryIdx = idx(/primary resource/i);
    const secondaryIdx = idx(/secondary|doesn't land|if this/i);
    const tierIdx = idx(/tier/i);
    const doneIdx = idx(/done/i);

    if (unitIdx === -1) continue; // not a units table (e.g. a different table in the section)

    for (const row of rows) {
      const cell = row[unitIdx] ?? "";
      const m = /^(\d+\.\d+)\s+(.*)$/.exec(cell.trim());
      if (!m) continue;
      const [, id, unitTitle] = m;
      const conceptsRaw = conceptsIdx >= 0 ? row[conceptsIdx] ?? "" : "";
      const concepts = conceptsRaw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const cellOrUndefined = (idx: number) => {
        if (idx < 0) return undefined;
        const val = (row[idx] ?? "").trim();
        return val && val !== "—" && val !== "-" ? val : undefined;
      };
      units.push({
        id,
        moduleNumber,
        title: unitTitle.trim(),
        concepts,
        primaryResource: cellOrUndefined(primaryIdx),
        secondaryResource: cellOrUndefined(secondaryIdx),
        doneCriteria: cellOrUndefined(doneIdx),
        tier: tierIdx >= 0 ? tierFromText(row[tierIdx] ?? "") : moduleTier,
        practiceLinks: practiceLinks[id] ?? [],
        raw: JSON.stringify(row),
      });
    }
  }
  return units;
}

function parseModules(markdown: string, practiceLinks: PracticeLinksMap): Module[] {
  const moduleSections = sectionsAtDepth(markdown, 2).filter((s) =>
    /^MODULE\s+\d+/i.test(s.title)
  );
  return moduleSections.map((section): Module => {
    const numMatch = /MODULE\s+(\d+)/i.exec(section.title);
    const number = numMatch ? parseInt(numMatch[1], 10) : 0;
    const titleMatch = /—\s*(.+)$/.exec(section.title);
    const rawTitle = titleMatch ? titleMatch[1].trim() : section.title;
    const tier = tierFromEmoji(rawTitle);
    const title = rawTitle.replace(/[🔴🟡🟢]/g, "").replace(/\s*\/\s*$/, "").trim();

    const root = parseMd(section.raw);
    const objective = root.children
      .filter((n) => n.type === "paragraph")
      .map((n) => boldLabelFromParagraph(n))
      .find((b) => b && /^objective$/i.test(b.label))?.rest;

    return {
      id: `module-${number}`,
      number,
      title,
      tier,
      objective,
      units: parseUnitsFromModule(section.raw, number, tier, practiceLinks),
      raw: section.raw,
    };
  });
}

function parseAppendixChecklist(markdown: string) {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /full concept checklist/i.test(s.title)
  );
  if (!section) return [];
  const root = parseMd(section.raw);
  const groups: { moduleTitle: string; items: ChecklistItem[] }[] = [];
  let current: { moduleTitle: string; items: ChecklistItem[] } | null = null;
  let counter = 0;
  for (const node of root.children) {
    if (node.type === "paragraph") {
      const bold = boldLabelFromParagraph(node);
      if (bold && /^module/i.test(bold.label) && !bold.rest) {
        current = { moduleTitle: bold.label, items: [] };
        groups.push(current);
      }
    } else if (node.type === "list" && current) {
      const items = listToChecklist(node);
      current.items.push(
        ...items.map((it) => ({
          id: `checklist-${counter++}`,
          text: it.text,
          checked: it.checked,
        }))
      );
    }
  }
  return groups;
}

const MODELED_SECTION_PATTERNS = [/^module\s+\d+/i, /^curriculum map/i, /^appendix/i];

function parseGenericSections(markdown: string): RoadmapSection[] {
  return sectionsAtDepth(markdown, 2)
    .filter((s) => !MODELED_SECTION_PATTERNS.some((p) => p.test(s.title)))
    .map((s) => ({
      id: slugify(s.title),
      title: s.title,
      level: 2,
      contentMarkdown: s.raw,
    }));
}

export function parseSyllabus(markdown: string, practiceLinks: PracticeLinksMap = {}): SyllabusData {
  const headings = headingsWithOffsets(markdown);
  const h1 = headings.find((h) => h.depth === 1);
  const title = h1 ? h1.text : "Syllabus";
  const nextHeadingStart = headings.find((h) => h.start > (h1?.start ?? 0))?.start ?? markdown.length;
  const introRoot = parseMd(markdown.slice(h1 ? h1.start : 0, nextHeadingStart));
  const introPara = introRoot.children.find((n) => n.type === "paragraph");
  const subtitle = introPara ? textOf(introPara as unknown as Content) : "";

  return {
    title,
    subtitle,
    curriculumMap: parseCurriculumMap(markdown),
    modules: parseModules(markdown, practiceLinks),
    appendixChecklist: parseAppendixChecklist(markdown),
    sections: parseGenericSections(markdown),
  };
}
