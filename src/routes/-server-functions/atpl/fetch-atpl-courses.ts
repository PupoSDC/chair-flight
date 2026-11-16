import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { atplCourses as courses } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchAtplCourses = createServerFn({ method: "GET" }).handler(
  () => {
    return getSupabaseDb()
      .select({ id: courses.id, text: courses.text })
      .from(courses)
      .orderBy(asc(courses.id));
  },
);
