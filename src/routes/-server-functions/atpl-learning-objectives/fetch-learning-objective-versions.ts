import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { atplLearningObjectiveVersions } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchLearningObjectiveVersions = createServerFn({
  method: "GET",
}).handler(() =>
  getSupabaseDb()
    .select({
      id: atplLearningObjectiveVersions.id,
      position: atplLearningObjectiveVersions.position,
      name: atplLearningObjectiveVersions.name,
      ecqbRelease: atplLearningObjectiveVersions.ecqbRelease,
      numberOfLearningObjectives:
        atplLearningObjectiveVersions.numberOfLearningObjectives,
    })
    .from(atplLearningObjectiveVersions)
    .orderBy(asc(atplLearningObjectiveVersions.position)),
);
