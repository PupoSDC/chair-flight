import { z } from "zod";
import { assertType, IsEqual } from "@chair-flight/base/utils";
import { Course } from "../types";

export const courseSchema = z.object({
  id: z.string(),
  text: z.string(),
});

type ICourse = z.infer<typeof courseSchema>;
assertType<IsEqual<ICourse, Course>>();
