import { z } from "zod";
import { assertType } from "@cf/base/utils";
import type { CourseId } from "./ids";
import type { IsEqual } from "@cf/base/utils";

export type Course = {
  id: CourseId;
  text: string;
};

export const courseSchema = z.object({
  id: z.string(),
  text: z.string(),
});

type ICourse = z.infer<typeof courseSchema>;
assertType<IsEqual<ICourse, Course>>();
