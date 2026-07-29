import {
  parseMd,
  textOf,
  tableToData,
  listToChecklist,
  findTables,
  findLists,
  slugify,
  boldLabelFromParagraph,
  listToItems,
} from "./lib/md";
import { sectionsAtDepth, headingsWithOffsets } from "./lib/sections";
import type {
  RoadmapData,
  Month,
  Week,
  WeekTask,
  DsaRow,
  ProjectItem,
  ResourceItem,
  PriorityTier,
  ChecklistItem,
  RoadmapSection,
  TableData,
} from "../src/types/content";
import type { Content, Paragraph, List } from "mdast";

function boldKeyValues(introText: string): Record<string, string> {
  const flat = introText.replace(/\r?\n/g, " ");
  const meta: Record<string, string> = {};
  const re = /\*\*([^*:]+):\*\*\s*([^*]+?)(?=(?:\s*·\s*)?\*\*[^*:]+:\*\*|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(flat))) {
    meta[m[1].trim()] = m[2]
      .trim()
      .replace(/\s*·\s*$/, "")
      .replace(/\s*-{2,}\s*$/, "")
      .trim();
  }
  return meta;
}

function splitNumberedItems(text: string): string[] {
  const items: string[] = [];
  const re = /(?:^|\s)(\d+)\.\s+/g;
  const matches: { index: number; len: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    matches.push({ index: m.index + m[0].indexOf(m[1]), len: m[0].length - (m[0].indexOf(m[1])) });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].len;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const item = text.slice(start, end).trim();
    if (item) items.push(item);
  }
  return items;
}

function paragraphsRaw(nodes: Content[]): { node: Paragraph; text: string }[] {
  return nodes
    .filter((n): n is Paragraph => n.type === "paragraph")
    .map((n) => ({ node: n, text: textOf(n) }));
}

function parseToc(markdown: string): { title: string; children: string[] }[] {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /table of contents/i.test(s.title)
  );
  if (!section) return [];
  const body = section.raw.split("\n").slice(1); // drop heading line
  const groups: { title: string; children: string[] }[] = [];
  let current: { title: string; children: string[] } | null = null;
  for (const lineRaw of body) {
    const line = lineRaw.trim();
    if (!line) continue;
    const boldMatch = /^\*\*(.+)\*\*$/.exec(line);
    if (boldMatch) {
      current = { title: boldMatch[1], children: [] };
      groups.push(current);
    } else if (current && /^\d+\.\d+/.test(line)) {
      current.children.push(line);
    }
  }
  return groups;
}

function extractProblems(text: string): number | undefined {
  const m = /~?\s*(\d+)(?:[\-–]\d+)?\s*problems?/i.exec(text);
  return m ? parseInt(m[1], 10) : undefined;
}

function parseMonths(markdown: string): Month[] {
  const roadmapPart = sectionsAtDepth(markdown, 2).find((s) =>
    /the 6-month roadmap/i.test(s.title)
  );
  if (!roadmapPart) return [];
  const monthSections = sectionsAtDepth(roadmapPart.raw, 3).filter((s) =>
    /^MONTH\s+\d+/i.test(s.title)
  );

  return monthSections.map((section): Month => {
    const numMatch = /MONTH\s+(\d+)/i.exec(section.title);
    const number = numMatch ? parseInt(numMatch[1], 10) : 0;
    const titleMatch = /—\s*(.+)$/.exec(section.title);
    const title = titleMatch ? titleMatch[1].trim() : section.title;

    const root = parseMd(section.raw);
    const paras = paragraphsRaw(root.children);
    const boldParas = paras
      .map((p) => ({ ...p, bold: boldLabelFromParagraph(p.node) }))
      .filter((p) => p.bold);

    const focus = boldParas.find((p) => /^focus$/i.test(p.bold!.label))?.bold?.rest;
    const projectText = boldParas.find((p) => /^project/i.test(p.bold!.label))?.bold
      ?.rest;

    const tables = findTables(root.children);
    const weeks: Week[] = [];
    if (tables.length > 0) {
      const { headers, rows } = tableToData(tables[0]);
      const taskHeaders = headers.slice(1);
      for (const row of rows) {
        const weekNumMatch = /(\d+)/.exec(row[0] ?? "");
        const weekNumber = weekNumMatch ? parseInt(weekNumMatch[1], 10) : 0;
        const tasks: WeekTask[] = [];
        row.slice(1).forEach((cell, i) => {
          const trimmed = (cell ?? "").trim();
          if (!trimmed || trimmed === "—" || trimmed === "-") return;
          tasks.push({
            column: taskHeaders[i] ?? `Column ${i + 1}`,
            text: trimmed,
            problems: extractProblems(trimmed),
          });
        });
        weeks.push({ id: `week-${weekNumber}`, number: weekNumber, tasks });
      }
    }

    const milestoneParaIdx = paras.findIndex((p) =>
      /Month\s+\d+\s+Milestone/i.test(p.text)
    );
    let milestones: ChecklistItem[] = [];
    if (milestoneParaIdx !== -1) {
      const milestoneNode = paras[milestoneParaIdx].node;
      const idxInChildren = root.children.indexOf(milestoneNode);
      const nextList = root.children
        .slice(idxInChildren + 1)
        .find((n): n is List => n.type === "list");
      if (nextList) {
        milestones = listToChecklist(nextList).map((c, i) => ({
          id: `month-${number}-milestone-${i}`,
          text: c.text,
          checked: c.checked,
        }));
      }
    }

    return {
      id: `month-${number}`,
      number,
      title,
      focus,
      weeks,
      projectText,
      milestones,
      raw: section.raw,
    };
  });
}

function parseDsaTable(markdown: string): DsaRow[] {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /dsa deep dive/i.test(s.title)
  );
  if (!section) return [];
  const root = parseMd(section.raw);
  const tables = findTables(root.children);
  if (tables.length === 0) return [];
  const { headers, rows } = tableToData(tables[0]);
  const idx = (name: string) =>
    headers.findIndex((h) => h.toLowerCase().includes(name));
  const weeksIdx = idx("week");
  const topicIdx = idx("topic");
  const problemsIdx = idx("problem");
  const cumulativeIdx = idx("cumulative");
  return rows.map((r) => ({
    weeks: r[weeksIdx] ?? "",
    topic: r[topicIdx] ?? "",
    problems: r[problemsIdx] ?? "",
    cumulative: r[cumulativeIdx] ?? "",
  }));
}

function parseProjects(markdown: string): ProjectItem[] {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /project portfolio plan/i.test(s.title)
  );
  if (!section) return [];
  const root = parseMd(section.raw);
  const lists = findLists(root.children);
  const topList = lists.find((l) => l.ordered) ?? lists[0];
  if (!topList) return [];

  // The paragraph right after the list states the universal "done" checklist
  // every project shares (e.g. "needs a live URL, a README, and test coverage").
  const listIdx = root.children.indexOf(topList);
  const trailingParagraph = root.children
    .slice(listIdx + 1)
    .find((n): n is Paragraph => n.type === "paragraph");
  const trailingText = trailingParagraph ? textOf(trailingParagraph) : "";
  const checklistSentence = /needs?[^:]*:\s*(.+?)\./i.exec(trailingText)?.[1] ?? "";
  const sharedChecklist = checklistSentence
    .split(/,\s*(?:and\s+)?|\s+and\s+/i)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => s.length > 3);

  return topList.children.map((item, i): ProjectItem => {
    const itemParagraph = item.children.find((c) => c.type === "paragraph");
    const nestedList = item.children.find((c): c is List => c.type === "list");
    const parsed = itemParagraph ? boldLabelFromParagraph(itemParagraph) : null;
    const full = textOf(item as unknown as Content);
    const label = parsed?.label ?? `Project ${i + 1}`;
    let description = parsed?.rest ?? full;
    if (nestedList) {
      description += " " + listToItems(nestedList).join(" · ");
    }
    const monthMatch = /Month\s+(\d+)/i.exec(label);
    return {
      id: `project-${i + 1}`,
      title: label.replace(/Month\s+\d+\s*—\s*/i, ""),
      month: monthMatch ? monthMatch[1] : undefined,
      description,
      isFlagship: /flagship/i.test(label) || /flagship/i.test(description),
      checklist: sharedChecklist.map((text, ci) => ({
        id: `project-${i + 1}-check-${ci}`,
        text,
        checked: false,
      })),
    };
  });
}

function guessUrl(text: string): string | undefined {
  const m = /\b([a-z0-9-]+\.(?:com|org|io|dev|net))\b/i.exec(text);
  return m ? `https://${m[1].toLowerCase()}` : undefined;
}

function parseResources(markdown: string): ResourceItem[] {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /learning resource guide/i.test(s.title)
  );
  if (!section) return [];
  const subsections = sectionsAtDepth(section.raw, 3);
  const resources: ResourceItem[] = [];
  let counter = 0;

  for (const sub of subsections) {
    const categoryMatch = /^\d+\.\d+\s+(.+)$/.exec(sub.title);
    const category = categoryMatch
      ? categoryMatch[1].replace(/\s*—.*$/, "").trim()
      : sub.title;
    const root = parseMd(sub.raw);
    const tables = findTables(root.children);
    for (const table of tables) {
      const { headers, rows } = tableToData(table);
      const conceptIdx = headers.findIndex((h) =>
        /concept|need/i.test(h)
      );
      const resourceIdx = headers.findIndex((h) => /resource/i.test(h));
      const formatIdx = headers.findIndex((h) =>
        /format|note|cost/i.test(h)
      );
      for (const row of rows) {
        const title = row[conceptIdx >= 0 ? conceptIdx : 0] ?? "";
        const primary = row[resourceIdx >= 0 ? resourceIdx : 1] ?? "";
        const format = formatIdx >= 0 ? row[formatIdx] ?? "" : "";
        if (!title) continue;
        counter++;
        resources.push({
          id: `resource-${counter}`,
          title,
          description: [primary, format].filter(Boolean).join(" — "),
          url: guessUrl(primary),
          category,
          format,
          tier: "unknown",
        });
      }
    }

    // 8.1 DSA prose has bolded resource labels instead of a table
    if (tables.length === 0) {
      const paras = paragraphsRaw(root.children);
      for (const p of paras) {
        const parsed = boldLabelFromParagraph(p.node);
        if (parsed && /primary|secondary|platform/i.test(parsed.label)) {
          counter++;
          resources.push({
            id: `resource-${counter}`,
            title: parsed.label,
            description: parsed.rest,
            url: guessUrl(parsed.rest),
            category,
            tier: "unknown",
          });
        }
      }
    }
  }
  return resources;
}

function parsePriorityOrder(markdown: string): PriorityTier[] {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /priority order/i.test(s.title)
  );
  if (!section) return [];
  const root = parseMd(section.raw);
  const tiers: PriorityTier[] = [];
  let current: PriorityTier | null = null;
  for (const node of root.children) {
    if (node.type === "paragraph") {
      const bold = boldLabelFromParagraph(node);
      if (bold && /^tier/i.test(bold.label)) {
        current = { tier: bold.label, items: splitNumberedItems(bold.rest) };
        tiers.push(current);
      }
    } else if (node.type === "list" && current && current.items.length === 0) {
      current.items.push(
        ...node.children.map((item) => textOf(item as unknown as Content))
      );
    }
  }
  return tiers;
}

function parseAppendixChecklist(markdown: string): ChecklistItem[] {
  const section = sectionsAtDepth(markdown, 2).find((s) =>
    /full milestone checklist/i.test(s.title)
  );
  if (!section) return [];
  const root = parseMd(section.raw);
  const lists = findLists(root.children);
  if (lists.length === 0) return [];
  return listToChecklist(lists[0]).map((c, i) => ({
    id: `appendix-${i}`,
    text: c.text,
    checked: c.checked,
  }));
}

function parseWeeklyTimeBudget(markdown: string): TableData | null {
  const part2 = sectionsAtDepth(markdown, 2).find((s) => /reality check/i.test(s.title));
  if (!part2) return null;
  const sub = sectionsAtDepth(part2.raw, 3).find((s) =>
    /weekly time budget/i.test(s.title)
  );
  if (!sub) return null;
  const root = parseMd(sub.raw);
  const tables = findTables(root.children);
  if (tables.length === 0) return null;
  return tableToData(tables[0]);
}

const MODELED_SECTION_PATTERNS = [
  /^part 3/i,
  /^part 4/i,
  /^part 5/i,
  /^part 8/i,
  /^part 9/i,
  /^appendix/i,
  /^table of contents/i,
];

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

export function parseRoadmap(markdown: string): RoadmapData {
  const headings = headingsWithOffsets(markdown);
  const h1 = headings.find((h) => h.depth === 1);
  const title = h1 ? h1.text : "Roadmap";
  const introEnd = headings.find((h) => h.start > (h1?.start ?? -1))?.start ?? markdown.length;
  const intro = markdown.slice(h1 ? h1.start : 0, introEnd);
  const meta = boldKeyValues(intro);

  return {
    title,
    subtitle: meta["Goal"] ?? "",
    meta,
    toc: parseToc(markdown),
    months: parseMonths(markdown),
    dsaTable: parseDsaTable(markdown),
    projects: parseProjects(markdown),
    resources: parseResources(markdown),
    priorityOrder: parsePriorityOrder(markdown),
    appendixChecklist: parseAppendixChecklist(markdown),
    sections: parseGenericSections(markdown),
    weeklyTimeBudget: parseWeeklyTimeBudget(markdown),
  };
}
