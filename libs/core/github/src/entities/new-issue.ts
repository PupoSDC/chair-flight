import { z } from "zod";

export const newIssueSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(10).max(1000),
  debugData: z.record(z.unknown()),
  href: z.string(),
});

export type NewIssue = z.infer<typeof newIssueSchema>;
