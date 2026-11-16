import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const ICON_MODULES = import.meta.glob<Record<string, FC<{ size?: number }>>>(
  ["../../libs/ui/icons/*-icon.tsx", "!../../libs/ui/icons/svg-icon.tsx"],
  { eager: true },
);

const ICONS = Object.values(ICON_MODULES)
  .flatMap((module) => Object.entries(module))
  .toSorted(([first], [second]) => first.localeCompare(second));

export const IconsStory: FC = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-3">
    {ICONS.map(([name, Icon]) => (
      <div
        key={name}
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border",
          "border-rule px-2 py-4",
        )}
      >
        <Icon size={28} />
        <span className="text-center text-xs break-all text-muted">{name}</span>
      </div>
    ))}
  </div>
);
