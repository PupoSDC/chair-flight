import { useState } from "react";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { cn } from "../../utils/cn";
import { Checkbox } from "./checkbox";
import type { FC } from "react";

export type NestedCheckboxItem = {
  id: string;
  label: string;
  subLabel: string;
  children: { id: string; label: string; subLabel: string }[];
};

const toArray = (record: Record<string, boolean>) =>
  Object.entries(record)
    .filter(([, checked]) => checked)
    .map(([id]) => id);

const ItemLabel: FC<{
  label: string;
  subLabel: string;
  indented?: boolean;
}> = ({ label, subLabel, indented }) => (
  <span
    className={cn(
      "flex min-w-0 flex-1 flex-col justify-between gap-0.5 sm:flex-row",
      "sm:items-center sm:gap-4",
    )}
  >
    <span
      className={cn(
        "text-sm font-semibold",
        indented ? "sm:min-w-0" : "min-w-0",
      )}
    >
      {label}
    </span>
    <span className="flex-none text-[11px] text-muted">{subLabel}</span>
  </span>
);

export const NestedCheckboxSelect: FC<{
  items: NestedCheckboxItem[];
  values: string[];
  className?: string;
  onChange: (values: string[]) => void;
}> = ({ items, values, className, onChange }) => {
  const [openId, setOpenId] = useState<string>();
  const valueMap = Object.fromEntries(values.map((value) => [value, true]));

  return (
    <fieldset className={cn("flex flex-col gap-1.5", className)}>
      {items.map((parent) => {
        const parentChecked = valueMap[parent.id] ?? false;
        const open = openId === parent.id;
        const indeterminate = parent.children.some(
          (child) => !!valueMap[child.id] !== !!valueMap[parent.children[0].id],
        );

        return (
          <div
            key={parent.id}
            className={cn(
              "overflow-hidden rounded-md border border-rule-strong bg-paper",
              "shadow-xs",
            )}
          >
            <div
              className={cn(
                "flex items-stretch",
                open && "border-b border-rule-strong",
              )}
            >
              <label
                className={cn(
                  "flex min-w-0 flex-1 cursor-pointer items-center gap-3 p-2",
                  "sm:p-2.5",
                )}
              >
                <Checkbox
                  checked={parentChecked}
                  indeterminate={indeterminate}
                  onChange={() => {
                    const next = { ...valueMap, [parent.id]: !parentChecked };
                    for (const child of parent.children) next[child.id] = false;
                    onChange(toArray(next));
                  }}
                />
                <ItemLabel label={parent.label} subLabel={parent.subLabel} />
              </label>
              <button
                type="button"
                aria-label={open ? "Collapse" : "Expand"}
                disabled={parent.children.length === 0}
                onClick={() => setOpenId(open ? undefined : parent.id)}
                className={cn(
                  "grid w-9 flex-none cursor-pointer place-items-center",
                  "border-0 border-l border-rule-strong bg-transparent p-0",
                  "text-accent hover:bg-accent-soft disabled:invisible",
                )}
              >
                <ChevronRightIcon
                  size={18}
                  className={cn(
                    "transition-transform duration-250",
                    open && "rotate-90",
                  )}
                />
              </button>
            </div>
            {open &&
              parent.children.map((child) => {
                const childChecked = valueMap[child.id] ?? parentChecked;
                return (
                  <label
                    key={child.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 p-2 pl-6",
                      "sm:p-2.5 sm:pl-8",
                    )}
                  >
                    <Checkbox
                      checked={childChecked}
                      onChange={() => {
                        const next = { ...valueMap };
                        if (parentChecked) {
                          next[parent.id] = false;
                          for (const sibling of parent.children) {
                            next[sibling.id] = true;
                          }
                        }
                        next[child.id] = !childChecked;
                        if (parent.children.every((c) => !!next[c.id])) {
                          next[parent.id] = true;
                          for (const sibling of parent.children) {
                            next[sibling.id] = false;
                          }
                        }
                        onChange(toArray(next));
                      }}
                    />
                    <ItemLabel
                      indented
                      label={child.label}
                      subLabel={child.subLabel}
                    />
                  </label>
                );
              })}
          </div>
        );
      })}
    </fieldset>
  );
};
