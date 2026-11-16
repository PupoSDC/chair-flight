import type { FC } from "react";

const COLORS = [
  "canvas",
  "paper",
  "ink",
  "muted",
  "rule",
  "rule-strong",
  "brand",
  "accent",
  "accent-soft",
  "success",
  "success-soft",
  "danger",
  "danger-soft",
  "warning",
];

export const ColorsStory: FC = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
    {COLORS.map((name) => (
      <div
        key={name}
        className="flex flex-col overflow-hidden rounded-xl border border-rule"
      >
        <div className="h-16" style={{ background: `var(--${name})` }} />
        <span className="px-3 py-2 text-xs text-muted">--{name}</span>
      </div>
    ))}
  </div>
);
