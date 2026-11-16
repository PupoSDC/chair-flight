import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { compareLearningObjectiveTrees } from "../../libs/core/learning-objectives/compare-learning-objective-trees";
import { findChangedLearningObjectiveIds } from "../../libs/core/learning-objectives/find-changed-learning-objective-ids";
import { Button } from "../../libs/ui/components/base/button";
import { Input } from "../../libs/ui/components/base/input";
import { Modal } from "../../libs/ui/components/base/modal";
import { SearchHighlightContext } from "../../libs/ui/components/base/search-highlight-context";
import { Select } from "../../libs/ui/components/base/select";
import { LearningObjectiveTable } from "../../libs/ui/components/question-bank/learning-objective-table";
import { cn } from "../../libs/ui/utils/cn";
import { fetchAtplCourses } from "../-server-functions/atpl/fetch-atpl-courses";
import { fetchLearningObjectiveQuestionCounts } from "../-server-functions/atpl-learning-objectives/fetch-learning-objective-question-counts";
import { fetchLearningObjectiveTree } from "../-server-functions/atpl-learning-objectives/fetch-learning-objective-tree";
import { fetchLearningObjectiveVersions } from "../-server-functions/atpl-learning-objectives/fetch-learning-objective-versions";
import type { FC } from "react";

const treeRequests = new Map<
  string,
  Promise<{
    tree: Awaited<ReturnType<typeof fetchLearningObjectiveTree>>;
    questionCounts: Record<string, number>;
  }>
>();

const requestLearningObjectiveTree = (
  versionId: string,
  withQuestionCounts: boolean,
) => {
  const key = `${versionId}-${withQuestionCounts}`;
  const known = treeRequests.get(key);
  if (known) return known;
  const request = Promise.all([
    fetchLearningObjectiveTree({ data: { version: versionId, format: 3 } }),
    withQuestionCounts
      ? fetchLearningObjectiveQuestionCounts()
      : Promise.resolve({} as Record<string, number>),
  ]).then(([tree, questionCounts]) => ({ tree, questionCounts }));
  request.catch(() => treeRequests.delete(key));
  treeRequests.set(key, request);
  return request;
};

const SECTIONS = ["added", "removed", "reworded", "renumbered", "courses"];

const PREVIEW_LIMIT = 20;

const LearningObjectiveCompare: FC<{
  versions: { id: string; name: string }[];
  from: string | undefined;
  to: string;
  onApply: (from: string, to: string) => void;
  onClose: () => void;
}> = ({ versions, from, to, onApply, onClose }) => {
  const [versionA, setVersionA] = useState(() => {
    const toIndex = versions.findIndex((version) => version.id === to);
    const fromIndex = versions.findIndex((version) => version.id === from);
    if (fromIndex >= 0 && fromIndex < toIndex) return versions[fromIndex].id;
    return versions[Math.max(toIndex - 1, 0)].id;
  });
  const [versionB, setVersionB] = useState(to);
  const [section, setSection] = useState("reworded");
  const [trees, setTrees] = useState<{
    before: Awaited<ReturnType<typeof requestLearningObjectiveTree>>["tree"];
    after: Awaited<ReturnType<typeof requestLearningObjectiveTree>>["tree"];
  } | null>(null);

  const comparison = useMemo(
    () =>
      trees ? compareLearningObjectiveTrees(trees.before, trees.after) : null,
    [trees],
  );

  useEffect(() => {
    let cancelled = false;
    setTrees(null);
    Promise.all([
      requestLearningObjectiveTree(versionA, false),
      requestLearningObjectiveTree(versionB, false),
    ]).then(([before, after]) => {
      if (!cancelled) setTrees({ before: before.tree, after: after.tree });
    });
    return () => {
      cancelled = true;
    };
  }, [versionA, versionB]);

  const versionIndexes = new Map(
    versions.map((version, index) => [version.id, index]),
  );
  const fromOptions = versions
    .filter(
      (version) =>
        (versionIndexes.get(version.id) ?? 0) <
        (versionIndexes.get(versionB) ?? 0),
    )
    .map((version) => ({ value: version.id, label: version.name }));
  const toOptions = versions
    .filter(
      (version) =>
        (versionIndexes.get(version.id) ?? 0) >
        (versionIndexes.get(versionA) ?? 0),
    )
    .map((version) => ({ value: version.id, label: version.name }));
  const entries =
    comparison?.rows.filter((row) => row.change === section) ?? [];

  return (
    <Modal
      title="Inspect changes"
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button
            disabled={!comparison}
            onClick={() => onApply(versionA, versionB)}
          >
            Show changes in table
          </Button>
        </div>
      }
    >
      <div className="flex h-112 max-h-[calc(100dvh-12rem)] flex-col gap-4">
        <div className="flex items-end gap-2">
          <div className="w-44">
            <Select
              label="From"
              placeholder="From"
              value={versionA}
              options={fromOptions}
              onChange={(event) => setVersionA(event.target.value)}
            />
          </div>
          <span className="flex h-8 items-center text-muted">→</span>
          <div className="w-44">
            <Select
              label="To"
              placeholder="To"
              value={versionB}
              options={toOptions}
              onChange={(event) => setVersionB(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SECTIONS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSection(name)}
              className={cn(
                "h-7 cursor-pointer rounded-md border px-2.5 text-xs",
                "font-semibold capitalize",
                section === name
                  ? "border-accent text-accent"
                  : "border-rule-strong text-muted hover:text-ink",
              )}
            >
              {name}
              {comparison && ` · ${comparison.counts[name] ?? 0}`}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {!comparison && (
            <p className="m-0 p-6 text-center text-sm text-muted">
              Comparing...
            </p>
          )}
          {comparison && entries.length === 0 && (
            <p className="m-0 p-6 text-center text-sm text-muted">
              Nothing {section}
            </p>
          )}
          <ul className="m-0 flex list-none flex-col p-0 text-[13px]">
            {entries.slice(0, PREVIEW_LIMIT).map((row) => (
              <li
                key={row.id}
                className={cn(
                  "grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 border-b",
                  "border-rule py-2",
                )}
              >
                <span className="font-semibold">{row.id}</span>
                <p className="m-0 line-clamp-2">{row.text}</p>
              </li>
            ))}
          </ul>
          {entries.length > PREVIEW_LIMIT && (
            <p className="m-0 text-center text-xs text-muted">
              and {entries.length - PREVIEW_LIMIT} more
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

const MODULE_ROUTE = getRouteApi("/(atpl)/modules/atpl");

const LearningObjectivesPage: FC = () => {
  const { q = "" } = Route.useSearch();
  const { subject, course, from } = Route.useSearch();
  const [comparing, setComparing] = useState(false);
  const [showUnchanged, setShowUnchanged] = useState(false);
  const { courses, versions, versionId } = Route.useLoaderData();
  const [loaded, setLoaded] = useState<{
    tree: Awaited<ReturnType<typeof requestLearningObjectiveTree>>["tree"];
    questionCounts: Record<string, number>;
    base:
      | Awaited<ReturnType<typeof requestLearningObjectiveTree>>["tree"]
      | null;
  } | null>(null);
  const subjects = MODULE_ROUTE.useLoaderData();
  const navigate = Route.useNavigate();

  const latest = versions.at(-1)?.id === versionId;

  const comparison = useMemo(
    () =>
      loaded?.base
        ? compareLearningObjectiveTrees(loaded.base, loaded.tree)
        : null,
    [loaded],
  );

  const items = useMemo(() => {
    const rows = comparison
      ? comparison.rows
      : (loaded?.tree ?? []).map((item) => ({
          ...item,
          change: null,
          previous: null,
        }));
    const changedIds =
      comparison && !showUnchanged
        ? findChangedLearningObjectiveIds(rows)
        : null;
    return rows
      .filter((item) => !changedIds || changedIds.has(item.id))
      .filter(
        (item) =>
          !subject || item.id === subject || item.id.startsWith(`${subject}.`),
      )
      .filter((item) => !course || item.courses.includes(course))
      .map((item) => ({
        ...item,
        numberOfQuestions: loaded?.questionCounts[item.id] ?? null,
      }));
  }, [loaded, comparison, showUnchanged, subject, course]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(null);
    Promise.all([
      requestLearningObjectiveTree(versionId, latest),
      from ? requestLearningObjectiveTree(from, false) : null,
    ]).then(([result, base]) => {
      if (!cancelled) setLoaded({ ...result, base: base?.tree ?? null });
    });
    return () => {
      cancelled = true;
    };
  }, [versionId, latest, from]);

  const [draft, setDraft] = useState(q);

  useEffect(() => {
    if (draft === q) return;
    const timeout = setTimeout(() => updateSearch("q", draft), 300);
    return () => clearTimeout(timeout);
  }, [draft, q]);

  const updateSearch = (name: string, value: string) =>
    navigate({
      replace: true,
      search: (previous) => ({
        ...previous,
        [name]: value === "all" || value === "" ? undefined : value,
      }),
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-wrap gap-2 p-3">
        <div className="min-w-48 flex-1 max-sm:basis-full">
          <Input
            label="Search"
            hideLabel
            type="search"
            placeholder="Search Learning Objectives..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
        <div className="w-36 max-sm:flex-1">
          <Select
            label="Subject"
            hideLabel
            placeholder="Subject"
            value={subject ?? ""}
            options={[
              { value: "", label: "All subjects" },
              ...subjects.map((item) => ({
                value: item.id,
                label: `${item.id} - ${item.shortName}`,
              })),
            ]}
            onChange={(event) => updateSearch("subject", event.target.value)}
          />
        </div>
        <div className="w-36 max-sm:flex-1">
          <Select
            label="Course"
            hideLabel
            placeholder="Course"
            value={course ?? ""}
            options={[
              { value: "", label: "All courses" },
              ...courses.map((item) => ({
                value: item.id,
                label: item.text,
              })),
            ]}
            onChange={(event) => updateSearch("course", event.target.value)}
          />
        </div>
        <Button onClick={() => setComparing(true)}>Inspect changes</Button>
      </div>
      {comparing && (
        <LearningObjectiveCompare
          versions={versions}
          from={from}
          to={versionId}
          onClose={() => setComparing(false)}
          onApply={(versionA, versionB) => {
            setComparing(false);
            navigate({
              replace: true,
              search: (previous) => ({
                ...previous,
                from: versionA,
                version: versionB,
              }),
            });
          }}
        />
      )}
      {from && (
        <div className="flex flex-none flex-wrap items-center gap-3 px-3 pb-2">
          <span className="text-[13px] font-semibold">
            {versions.find((version) => version.id === from)?.name} →{" "}
            {versions.find((version) => version.id === versionId)?.name}
          </span>
          <span className="text-xs text-muted">
            {Object.entries(comparison?.counts ?? {})
              .map(([change, count]) => `${count} ${change}`)
              .join(" · ")}
          </span>
          <Button
            className="ml-auto"
            onClick={() => setShowUnchanged((current) => !current)}
          >
            {showUnchanged ? "Only changes" : "Show unchanged"}
          </Button>
          <Button
            onClick={() =>
              navigate({
                replace: true,
                search: (previous) => ({ ...previous, from: undefined }),
              })
            }
          >
            Exit comparison
          </Button>
        </div>
      )}
      <div className="min-h-0 flex-1 px-3 pb-3">
        <SearchHighlightContext value={q}>
          {loaded && comparison && items.length === 0 ? (
            <p className="m-0 p-6 text-center text-sm text-muted">
              No changes between these versions
              {subject || course ? " for this subject and course" : ""}. Try
              another subject or course, or show unchanged.
            </p>
          ) : (
            <LearningObjectiveTable
              key={`${subject ?? "all"}-${course ?? "all"}-${versionId}-${from}-${showUnchanged}`}
              loading={!loaded}
              items={items}
              query={q}
              courses={courses}
            />
          )}
        </SearchHighlightContext>
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/(atpl)/modules/atpl/learning-objectives/",
)({
  staticData: { breadcrumbs: () => [{ label: "Learning Objectives" }] },
  validateSearch: z.object({
    q: z.string().optional(),
    version: z.string().optional(),
    subject: z.string().optional(),
    course: z.string().optional(),
    from: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({
    version: search.version,
  }),
  loader: async ({ deps }) => {
    const [versions, courses] = await Promise.all([
      fetchLearningObjectiveVersions(),
      fetchAtplCourses(),
    ]);
    const versionId =
      versions.find((version) => version.id === deps.version)?.id ??
      versions.at(-1)?.id;
    if (!versionId) throw new Error("No learning objective versions found.");
    return { courses, versions, versionId };
  },
  staleTime: Number.POSITIVE_INFINITY,
  component: LearningObjectivesPage,
});
