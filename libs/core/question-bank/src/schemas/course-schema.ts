import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type { Course } from "../types";
import type { IsEqual } from "@chair-flight/base/utils";

export const courseSchema = z.object({
  id: z.string(),
  text: z.string(),
});

type ICourse = z.infer<typeof courseSchema>;
assertType<IsEqual<ICourse, Course>>();
