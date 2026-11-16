import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { Highlight } from "../base/search-highlight";
import type { FC } from "react";

type ThreadItem = {
  id: string;
  parentId: string | null;
  level: number;
  text: string;
  items: string[];
  source: string;
  courses: string[];
  numberOfQuestions: number | null;
  change?: string | null;
  previous?: {
    id: string;
    text: string;
    items: string[];
    courses: string[];
  } | null;
};

type ThreadNode = {
  item: ThreadItem;
  children: ThreadNode[];
};

type FoldCommand = {
  level: number;
  nonce: number;
};

type Course = {
  id: string;
  text: string;
};

const buildThreadNodes = (items: ThreadItem[]) => {
  const nodesById = new Map(
    items.map((item) => [item.id, { item, children: [] as ThreadNode[] }]),
  );
  return items.flatMap((item) => {
    const node = nodesById.get(item.id);
    if (!node) return [];
    const parent = item.parentId ? nodesById.get(item.parentId) : undefined;
    if (!parent) return [node];
    parent.children.push(node);
    return [];
  });
};

const findVisibleIds = (items: ThreadItem[], query: string) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const childIdsByParentId = items.reduce((result, item) => {
    if (item.parentId) {
      result.set(item.parentId, [
        ...(result.get(item.parentId) ?? []),
        item.id,
      ]);
    }
    return result;
  }, new Map<string, string[]>());
  const visibleIds = new Set<string>();
  const addAncestors = (parentId: string | null) => {
    if (!parentId || !itemsById.has(parentId) || visibleIds.has(parentId)) {
      return;
    }
    visibleIds.add(parentId);
    addAncestors(itemsById.get(parentId)?.parentId ?? null);
  };
  const addDescendants = (id: string) => {
    visibleIds.add(id);
    for (const childId of childIdsByParentId.get(id) ?? []) {
      addDescendants(childId);
    }
  };
  for (const item of items) {
    const haystack = `${item.id} ${item.text}`.toLowerCase();
    if (!words.every((word) => haystack.includes(word))) continue;
    addDescendants(item.id);
    addAncestors(item.parentId);
  }
  return visibleIds;
};

const ItemText: FC<{
  text: string;
  items: string[];
  className?: string;
}> = ({ text, items, className }) => (
  <div className={cn("leading-6 wrap-break-word", className)}>
    <p className="m-0">
      <Highlight>{text}</Highlight>
    </p>
    {items.length > 0 && (
      <ul className="mt-3 mb-0 list-disc pl-6">
        {items.map((item) => (
          <li key={item}>
            <Highlight>{item}</Highlight>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const TableSkeleton: FC = () => (
  <div
    role="status"
    aria-label="Loading Learning Objectives"
    className={cn(
      "relative h-full overflow-hidden rounded-lg border border-rule",
      "bg-paper text-[13px]",
    )}
  >
    <div
      className={cn(
        "grid grid-cols-[12.5rem_minmax(0,1fr)]",
        "xl:grid-cols-[12.5rem_minmax(0,1fr)_5.5rem_5rem]",
        "h-8 items-center border-b border-rule text-xs font-semibold",
        "text-muted",
      )}
    >
      {["Learning Objective", "Description", "Courses", "Questions"].map(
        (header, index) => (
          <div
            key={header}
            className={cn(
              index === 0 && "pl-3",
              index > 1 && "max-xl:hidden",
              index === 3 && "pr-3 text-right",
            )}
          >
            {header}
          </div>
        ),
      )}
    </div>
    {[0, 1, 2, 2, 2, 1, 2, 2, 3, 3, 2, 1, 2, 2, 0, 1].map((depth, index) => (
      <div
        key={index}
        className={cn(
          "grid grid-cols-[12.5rem_minmax(0,1fr)]",
          "xl:grid-cols-[12.5rem_minmax(0,1fr)_5.5rem_5rem]",
          "h-12 animate-pulse",
        )}
      >
        <div
          className="flex items-center border-b border-rule"
          style={{ marginLeft: `${0.75 + depth}rem` }}
        >
          <div className="h-3 w-20 rounded bg-rule" />
        </div>
        <div className="flex items-center border-b border-rule pr-4">
          <div
            className="h-3 rounded bg-rule"
            style={{ width: `${40 + ((index * 17) % 50)}%` }}
          />
        </div>
        <div className="flex items-center border-b border-rule max-xl:hidden">
          <div className="h-2 w-12 rounded bg-rule" />
        </div>
        <div className="border-b border-rule max-xl:hidden" />
      </div>
    ))}
    <div className="absolute inset-0 top-8 flex items-center justify-center">
      <div
        className={cn(
          "size-8 animate-spin rounded-full border-2 border-rule-strong",
          "border-t-accent",
        )}
      />
    </div>
  </div>
);

const CHANGE_CLASS_NAMES: Record<string, string> = {
  added: "bg-green-500/15 text-green-600 dark:text-green-400",
  removed: "bg-red-500/15 text-red-600 dark:text-red-400",
  reworded: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  renumbered: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  courses: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
};

const ChangeBadge: FC<{ item: ThreadItem }> = ({ item }) =>
  item.change ? (
    <span
      className={cn(
        "mr-2 rounded px-1.5 py-px text-[10px] font-semibold uppercase",
        CHANGE_CLASS_NAMES[item.change],
      )}
    >
      {item.change}
      {item.change === "renumbered" && item.previous
        ? ` from ${item.previous.id}`
        : ""}
    </span>
  ) : null;

const CoursesCell: FC<{
  item: ThreadItem;
  courses: Course[];
  parent: boolean;
}> = ({ item, courses, parent }) => (
  <div
    className={cn(
      "border-b border-rule",
      "text-[8px] tracking-wider text-muted max-xl:hidden",
      parent && "pointer-events-auto flex cursor-pointer items-center bg-paper",
    )}
  >
    {item.courses.length > 0 && (
      <span
        data-courses={item.courses.join(" ")}
        className="inline-block cursor-default"
      >
        {courses
          .map((course) => (item.courses.includes(course.id) ? "●" : "○"))
          .join("")}
      </span>
    )}
  </div>
);

const QuestionsCell: FC<{
  item: ThreadItem;
  parent: boolean;
}> = ({ item, parent }) => (
  <div
    className={cn(
      "border-b border-rule",
      "justify-end pr-3 text-xs text-muted tabular-nums max-xl:hidden",
      parent && "pointer-events-auto flex cursor-pointer items-center bg-paper",
    )}
  >
    {item.numberOfQuestions || ""}
  </div>
);

const ParentRow = memo<{
  item: ThreadItem;
  depth: number;
  courses: Course[];
  onToggle: () => void;
}>(({ item, depth, courses, onToggle }) => (
  // biome-ignore lint/a11y/useSemanticElements: grid row cannot be a button
  <div
    role="button"
    tabIndex={0}
    onClick={onToggle}
    onKeyDown={(event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onToggle();
    }}
    className={cn(
      "grid grid-cols-[12.5rem_minmax(0,1fr)]",
      "xl:grid-cols-[12.5rem_minmax(0,1fr)_5.5rem_5rem]",
      "pointer-events-none h-8",
    )}
    style={{
      position: "sticky",
      top: `${2 + depth * 2}rem`,
      zIndex: 10 - depth,
    }}
  >
    <div
      className={cn(
        "border-b border-rule",
        "pointer-events-auto flex cursor-pointer items-center bg-paper pr-2",
        "font-semibold",
      )}
      style={{ marginLeft: `${0.75 + depth}rem` }}
    >
      <Highlight>{item.id}</Highlight>
    </div>
    <div
      title={item.text}
      className={cn(
        "border-b border-rule",
        "pointer-events-auto flex cursor-pointer items-center truncate",
        "bg-paper pr-4 font-semibold",
      )}
    >
      <ChangeBadge item={item} />
      <span
        className={cn("truncate", item.change === "removed" && "line-through")}
      >
        <Highlight>{item.text}</Highlight>
      </span>
    </div>
    <CoursesCell item={item} courses={courses} parent />
    <QuestionsCell item={item} parent />
  </div>
));

const LeafRow = memo<{
  item: ThreadItem;
  depth: number;
  courses: Course[];
}>(({ item, depth, courses }) => (
  <div
    className={cn(
      "grid grid-cols-[12.5rem_minmax(0,1fr)]",
      "xl:grid-cols-[12.5rem_minmax(0,1fr)_5.5rem_5rem]",
      "[contain-intrinsic-size:auto_3.5rem] [content-visibility:auto]",
      item.change === "added" && "bg-green-500/5",
      item.change === "removed" && "bg-red-500/5",
    )}
  >
    <div
      className={cn("border-b border-rule", "py-2 pt-2.5 pr-2 font-semibold")}
      style={{ marginLeft: `${0.75 + depth}rem` }}
    >
      <Highlight>{item.id}</Highlight>
    </div>
    <div
      className={cn(
        "border-b border-rule",
        "py-2 pr-4",
        item.change === "removed" && "text-muted line-through",
      )}
    >
      {item.change && (
        <div className="mb-1">
          <ChangeBadge item={item} />
        </div>
      )}
      {item.change === "reworded" && item.previous && (
        <ItemText
          text={item.previous.text}
          items={item.previous.items}
          className="mb-2 text-muted line-through"
        />
      )}
      {item.change === "courses" && item.previous && (
        <p className="m-0 mb-1 text-xs text-muted">
          Was: {item.previous.courses.join(", ") || "none"}
        </p>
      )}
      <ItemText text={item.text} items={item.items} />
      {item.source && (
        <div className="mt-1.5 text-[11px] whitespace-pre-line text-muted/75">
          {item.source}
        </div>
      )}
    </div>
    <CoursesCell item={item} courses={courses} parent={false} />
    <QuestionsCell item={item} parent={false} />
  </div>
));

const ThreadBranch = memo<{
  node: ThreadNode;
  depth: number;
  visibleIds: Set<string> | null;
  command: FoldCommand | null;
  courses: Course[];
}>(({ node, depth, visibleIds, command, courses }) => {
  const foldsAtCommand = (current: FoldCommand) =>
    current.level > 0 && depth + 1 >= current.level;
  const [collapsed, setCollapsed] = useState(
    command ? foldsAtCommand(command) : false,
  );

  useEffect(() => {
    if (command) setCollapsed(foldsAtCommand(command));
  }, [command]);

  const children = visibleIds
    ? node.children.filter((child) => visibleIds.has(child.item.id))
    : node.children;
  const open = !collapsed;
  const toggle = useCallback(() => setCollapsed((current) => !current), []);
  const parent = children.length > 0;
  return (
    <div
      className={cn(
        "relative",
        depth === 0 &&
          cn(
            "-mt-px before:absolute before:inset-x-0 before:-top-px",
            "before:z-30 before:h-0.5 before:bg-rule",
            "[&:nth-child(2)]:mt-0 [&:nth-child(2)]:before:hidden",
          ),
      )}
    >
      {parent ? (
        <ParentRow
          item={node.item}
          depth={depth}
          courses={courses}
          onToggle={toggle}
        />
      ) : (
        <LeafRow item={node.item} depth={depth} courses={courses} />
      )}
      {parent && open && (
        <>
          <button
            type="button"
            aria-label={`Collapse ${node.item.id}`}
            onClick={() => setCollapsed(true)}
            className={cn(
              "group absolute bottom-0 flex w-4 cursor-pointer",
              "justify-center",
            )}
            style={{ left: `${0.75 + depth}rem`, top: "2rem", zIndex: 1 }}
          >
            <span
              className={cn(
                "block w-px bg-muted/70",
                "group-hover:w-0.5 group-hover:bg-accent",
              )}
            />
          </button>
          {children.map((child) => (
            <ThreadBranch
              key={child.item.id}
              node={child}
              depth={depth + 1}
              visibleIds={visibleIds}
              command={command}
              courses={courses}
            />
          ))}
        </>
      )}
    </div>
  );
});

export const LearningObjectiveTable: FC<{
  items: ThreadItem[];
  query: string;
  courses: Course[];
  loading?: boolean;
}> = ({ items, query, courses, loading = false }) => {
  const [command, setCommand] = useState<FoldCommand | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLUListElement>(null);
  const chordPendingRef = useRef(false);
  const chordTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const roots = useMemo(() => buildThreadNodes(items), [items]);
  const visibleIds = useMemo(
    () => findVisibleIds(items, query),
    [items, query],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (["Meta", "Control", "Shift", "Alt"].includes(event.key)) return;
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        chordPendingRef.current = true;
        clearTimeout(chordTimeoutRef.current);
        chordTimeoutRef.current = setTimeout(() => {
          chordPendingRef.current = false;
        }, 2000);
        return;
      }
      const wasPending = chordPendingRef.current;
      chordPendingRef.current = false;
      if (!wasPending || !modifier || !/^[0-4]$/.test(event.key)) return;
      event.preventDefault();
      setCommand({ level: Number(event.key), nonce: Date.now() });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(chordTimeoutRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const container = scrollRef.current;
    const popover = popoverRef.current;
    if (!container || !popover) return;
    const hide = () => {
      popover.hidden = true;
    };
    const show = (event: MouseEvent) => {
      const row = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-courses]",
      );
      const appliesTo = row?.dataset.courses;
      if (!row || !appliesTo) return hide();
      const applicable = appliesTo.split(" ");
      for (const entry of Array.from(popover.children)) {
        const element = entry as HTMLElement;
        element.dataset.applies = String(
          applicable.includes(element.dataset.courseId ?? ""),
        );
      }
      popover.hidden = false;
      const rowRect = row.getBoundingClientRect();
      const popoverHeight = popover.offsetHeight;
      const below = rowRect.bottom + popoverHeight < window.innerHeight;
      popover.style.top = `${below ? rowRect.bottom + 4 : rowRect.top - popoverHeight - 4}px`;
      popover.style.left = `${rowRect.right - popover.offsetWidth}px`;
    };
    container.addEventListener("mouseover", show);
    container.addEventListener("mouseleave", hide);
    container.addEventListener("scroll", hide, { passive: true });
    return () => {
      container.removeEventListener("mouseover", show);
      container.removeEventListener("mouseleave", hide);
      container.removeEventListener("scroll", hide);
    };
  }, [loading, mounted]);

  if (loading) return <TableSkeleton />;

  if (roots.length === 0 || (visibleIds && visibleIds.size === 0)) {
    return (
      <p className="m-0 p-6 text-center text-sm text-muted">
        No Learning Objectives found
      </p>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "h-full overflow-auto rounded-lg border border-rule bg-paper",
        "text-[13px]",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-[12.5rem_minmax(0,1fr)]",
          "xl:grid-cols-[12.5rem_minmax(0,1fr)_5.5rem_5rem]",
          "sticky top-0 z-20 h-8 items-center border-b border-rule bg-paper",
          "text-xs font-semibold text-muted",
        )}
      >
        {["Learning Objective", "Description", "Courses", "Questions"].map(
          (header, index) => (
            <div
              key={header}
              className={cn(
                index === 0 && "pl-3",
                index > 1 && "max-xl:hidden",
                index === 3 && "pr-3 text-right",
              )}
            >
              {header}
            </div>
          ),
        )}
      </div>
      {roots.map((root) => (
        <ThreadBranch
          key={root.item.id}
          node={root}
          depth={0}
          visibleIds={visibleIds}
          command={command}
          courses={courses}
        />
      ))}
      {mounted &&
        createPortal(
          <ul
            ref={popoverRef}
            hidden
            className={cn(
              "fixed z-40 m-0 w-56 list-none rounded-md border border-rule",
              "bg-paper p-2 text-xs shadow-lg",
            )}
          >
            {courses.map((course) => (
              <li
                key={course.id}
                data-course-id={course.id}
                className={cn(
                  "py-0.5 text-ink",
                  "data-[applies=false]:text-muted/60",
                  "data-[applies=false]:line-through",
                )}
              >
                {course.text}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
};
