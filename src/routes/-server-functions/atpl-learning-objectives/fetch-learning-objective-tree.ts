import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  atplLearningObjectiveRevisions,
  atplLearningObjectiveVersions,
} from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchLearningObjectiveTree = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      version: z.string().min(1),
      format: z.literal(3),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const revisions = atplLearningObjectiveRevisions;
    const versions = await db
      .select({ id: atplLearningObjectiveVersions.id })
      .from(atplLearningObjectiveVersions)
      .orderBy(asc(atplLearningObjectiveVersions.position));
    if (!versions.some((version) => version.id === data.version)) {
      throw new Error("Unknown version.");
    }
    const rows = await db
      .select({
        id: revisions.id,
        parentId: revisions.parentId,
        level: revisions.level,
        text: revisions.text,
        items: revisions.items,
        source: revisions.source,
        courses: revisions.courses,
      })
      .from(revisions)
      .where(eq(revisions.version, data.version))
      .orderBy(asc(revisions.id));
    setResponseHeader(
      "Cache-Control",
      "public, max-age=31536000, s-maxage=31536000, immutable",
    );
    return rows;
  });
