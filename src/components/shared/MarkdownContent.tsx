import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";

export function MarkdownContent({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-a:text-accent prose-strong:text-foreground",
        "prose-table:text-xs prose-th:bg-surface-2",
        "prose-pre:bg-surface-2 prose-pre:border prose-pre:border-border prose-pre:rounded-lg",
        "prose-code:text-accent prose-code:bg-surface-2 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "[&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>{markdown}</ReactMarkdown>
    </div>
  );
}
