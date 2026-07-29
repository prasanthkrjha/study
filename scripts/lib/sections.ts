import { parseMd, textOf } from "./md";

export interface HeadingInfo {
  depth: number;
  text: string;
  start: number;
}

export function headingsWithOffsets(markdown: string): HeadingInfo[] {
  const root = parseMd(markdown);
  return root.children
    .filter((n) => n.type === "heading")
    .map((h) => ({
      depth: (h as { depth: number }).depth,
      text: textOf(h as never),
      start: h.position!.start.offset!,
    }));
}

export interface RawSection {
  title: string;
  depth: number;
  raw: string;
}

/** Slices `markdown` into sections at the given heading depth, using
 * CommonMark section semantics: a section runs until the next heading
 * whose depth is <= the target depth. */
export function sectionsAtDepth(markdown: string, depth: number): RawSection[] {
  const headings = headingsWithOffsets(markdown);
  const targets = headings.filter((h) => h.depth === depth);
  return targets.map((t) => {
    const next = headings.find((h) => h.start > t.start && h.depth <= depth);
    const end = next ? next.start : markdown.length;
    return { title: t.text, depth, raw: markdown.slice(t.start, end) };
  });
}

export function firstHeadingText(markdown: string, depth: number): string {
  const headings = headingsWithOffsets(markdown);
  return headings.find((h) => h.depth === depth)?.text ?? "";
}
