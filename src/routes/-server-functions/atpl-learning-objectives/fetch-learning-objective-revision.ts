import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  atplCourses,
  atplLearningObjectiveRevisions,
  atplLearningObjectives,
  atplLearningObjectiveVersions,
} from "../../../database";
import { liftLearningObjectiveSources } from "../../../libs/core/learning-objectives/lift-learning-objective-sources";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import { countLearningObjectiveQuestions } from "./count-learning-objective-questions";

export const fetchLearningObjectiveRevision = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      learningObjectiveId: z.string().min(1),
      version: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const revisions = atplLearningObjectiveRevisions;
    const [versions, occurrences, courseRows] = await Promise.all([
      db
        .select()
        .from(atplLearningObjectiveVersions)
        .orderBy(asc(atplLearningObjectiveVersions.position)),
      db
        .select()
        .from(revisions)
        .where(eq(revisions.id, data.learningObjectiveId)),
      db.select().from(atplCourses),
    ]);
    const occurrenceVersionIds = new Set(
      occurrences.map((occurrence) => occurrence.version),
    );
    const selectedVersion = data.version
      ? versions.find((version) => version.id === data.version)
      : versions.findLast((version) => occurrenceVersionIds.has(version.id));
    const revision = occurrences.find(
      (occurrence) => occurrence.version === selectedVersion?.id,
    );
    if (!selectedVersion || !revision) throw notFound();
    const isLatest = versions.at(-1)?.id === selectedVersion.id;
    const [subtree, [current], currentChildren] = await Promise.all([
      db
        .select({
          id: revisions.id,
          parentId: revisions.parentId,
          text: revisions.text,
          items: revisions.items,
          source: revisions.source,
        })
        .from(revisions)
        .where(
          and(
            eq(revisions.version, selectedVersion.id),
            eq(revisions.subject, revision.subject),
          ),
        )
        .orderBy(asc(revisions.id)),
      isLatest
        ? db
            .select({
              docId: atplLearningObjectives.docId,
              numberOfQuestions: countLearningObjectiveQuestions(),
            })
            .from(atplLearningObjectives)
            .where(eq(atplLearningObjectives.id, revision.id))
        : Promise.resolve([]),
      isLatest
        ? db
            .select({
              id: atplLearningObjectives.id,
              numberOfQuestions: countLearningObjectiveQuestions(),
            })
            .from(atplLearningObjectives)
            .where(
              and(
                eq(atplLearningObjectives.parentId, revision.id),
                eq(atplLearningObjectives.removed, false),
              ),
            )
        : Promise.resolve([]),
    ]);
    const questionCounts = new Map(
      currentChildren.map((child) => [child.id, child.numberOfQuestions]),
    );
    const liftedSource =
      liftLearningObjectiveSources(subtree).find(
        (row) => row.id === revision.id,
      )?.source ?? "";
    return {
      revision: {
        ...revision,
        source: liftedSource,
        courses: courseRows.filter((course) =>
          revision.courses.includes(course.id),
        ),
      },
      version: selectedVersion,
      versions: versions.map((version) => ({
        id: version.id,
        name: version.name,
        present: occurrenceVersionIds.has(version.id),
      })),
      parent: subtree.find((row) => row.id === revision.parentId) ?? null,
      children: subtree
        .filter((row) => row.parentId === revision.id)
        .map((child) => ({
          id: child.id,
          text: child.text,
          items: child.items,
          numberOfQuestions: questionCounts.get(child.id) ?? null,
        })),
      current: current ?? null,
    };
  });
