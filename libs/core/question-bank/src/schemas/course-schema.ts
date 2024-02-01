import { z } from "zod";
import { Course } from "../types";
import { assertType, IsEqual } from "@chair-flight/base/utils";


export const courseSchema = z.object({
    id: z.string(),
    text: z.string(),
});

type ICourse = z.infer<typeof courseSchema>;
assertType<IsEqual<ICourse, Course>>();