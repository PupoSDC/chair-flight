import { z } from "zod";

export type PageEvent = {
  anonymousId: string;
  title: string;
  path: string;
  resolvedPath: string;
  height: number;
  width: number;
  referrer?: string;
  timestamp: number;
};

export const PageEventSchema: z.ZodSchema<PageEvent> = z.object({
  anonymousId: z.string(),
  title: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  height: z.number(),
  width: z.number(),
  referrer: z.string().optional(),
  timestamp: z.number(),
});
