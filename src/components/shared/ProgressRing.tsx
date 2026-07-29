"use client";

import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  color = "var(--accent)",
  label,
  className,
}: {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: React.ReactNode;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="progress-ring-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        {label ?? <span className="text-sm font-semibold">{Math.round(value)}%</span>}
      </div>
    </div>
  );
}
