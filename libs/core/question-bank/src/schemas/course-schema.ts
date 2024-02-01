import { z } from "zod";
import type { IsEqual } from "@chair-flight/base/utils";
import { assertType } from "@chair-flight/base/utils";
import type { Course } from "../types";

export const courseSchema = z.object({
  id: z.string(),
  text: z.string(),
});

type ICourse = z.infer<typeof courseSchema>;
assertType<IsEqual<ICourse, Course>>();
