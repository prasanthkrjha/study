import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Root, Content, Table, List } from "mdast";

export function parseMd(markdown: string): Root {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
}

export function textOf(node: Content | Root): string {
  return mdastToString(node).replace(/\s+/g, " ").trim();
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export function tableToData(table: Table): TableData {
  const rows = table.children.map((row) =>
    row.children.map((cell) => textOf(cell))
  );
  const [headers, ...body] = rows;
  return { headers: headers ?? [], rows: body };
}

export interface ChecklistNode {
  text: string;
  checked: boolean;
}

export function listToChecklist(list: List): ChecklistNode[] {
  return list.children
    .filter((item) => typeof item.checked === "boolean")
    .map((item) => ({
      text: textOf(item as unknown as Content).replace(/^\s*/, ""),
      checked: !!item.checked,
    }));
}

export function listToItems(list: List): string[] {
  return list.children.map((item) => textOf(item as unknown as Content));
}

/** Extracts a "**Label:** rest of text" pattern from a paragraph's mdast
 * children directly (not from stripped text, which loses the `**` markers
 * that make this pattern detectable). */
export function boldLabelFromParagraph(
  node: Content
): { label: string; rest: string } | null {
  const children = (node as unknown as { children?: Content[] }).children;
  if (!children || children.length === 0) return null;
  const first = children[0];
  if (first.type !== "strong") return null;
  const label = textOf(first).replace(/:\s*$/, "").trim();
  const restNode = { type: "root", children: children.slice(1) } as unknown as Root;
  const rest = textOf(restNode).replace(/^:\s*/, "").trim();
  return { label, rest };
}

/** Splits top-level mdast children into a flat outline: heading nodes carry
 * their depth, everything else is content belonging to the preceding heading. */
export interface OutlineNode {
  type: "heading" | "content";
  depth?: number;
  text?: string;
  node: Content;
}

export function outline(root: Root): OutlineNode[] {
  return root.children.map((node) => {
    if (node.type === "heading") {
      return { type: "heading", depth: node.depth, text: textOf(node), node };
    }
    return { type: "content", node };
  });
}

/** Groups an outline into sections keyed by heading depth <= maxDepth. */
export interface Section {
  title: string;
  depth: number;
  children: Content[];
  headingNode: Content | null;
}

export function sectionize(items: OutlineNode[], depth: number): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const item of items) {
    if (item.type === "heading" && item.depth === depth) {
      current = {
        title: item.text ?? "",
        depth,
        children: [],
        headingNode: item.node,
      };
      sections.push(current);
    } else if (current) {
      current.children.push(item.node);
    }
  }
  return sections;
}

export function findTables(nodes: Content[]): Table[] {
  return nodes.filter((n): n is Table => n.type === "table");
}

export function findLists(nodes: Content[]): List[] {
  return nodes.filter((n): n is List => n.type === "list");
}

export function findParagraphTexts(nodes: Content[]): string[] {
  return nodes
    .filter((n) => n.type === "paragraph")
    .map((n) => textOf(n));
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
