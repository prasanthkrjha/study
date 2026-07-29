import { cn } from "@/lib/utils";
import type { Tier } from "@/types/content";

const TIER_STYLES: Record<Tier, string> = {
  essential: "bg-danger/10 text-danger border-danger/20",
  recommended: "bg-accent-3/15 text-accent-3 border-accent-3/25",
  optional: "bg-accent-2/15 text-accent-2 border-accent-2/25",
  unknown: "bg-muted/10 text-muted border-border",
};

const TIER_LABELS: Record<Tier, string> = {
  essential: "Essential",
  recommended: "Recommended",
  optional: "Optional",
  unknown: "General",
};

export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        TIER_STYLES[tier],
        className
      )}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
