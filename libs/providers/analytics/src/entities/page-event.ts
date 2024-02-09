import { type InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import type { pageEvent } from "../../drizzle/schema";

export type PageEvent = Pick<
  InferSelectModel<typeof pageEvent>,
  "anonymousId" | "title" | "path" | "resolvedPath" | "height" | "width"
>;

export const pageEventSchema: z.ZodSchema<PageEvent> = z.strictObject({
  anonymousId: z.string(),
  title: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  height: z.number(),
  width: z.number(),
});
