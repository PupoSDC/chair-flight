import { z } from "zod";
import { getOctokit } from "../config/oktokit";

export const newIssueSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(10).max(1000),
  debugData: z.record(z.unknown()),
  href: z.string(),
});

export const createNewIssue = async (
  schema: z.infer<typeof newIssueSchema>,
) => {
  const { title, description, debugData, href } = schema;
  const { octokit, originOwner, originRepo } = getOctokit();

  const response = await octokit.rest.issues.create({
    owner: originOwner,
    repo: originRepo,
    title: `[App Bug Report] ${title}`,
    body: [
      `## Data\n`,
      `**href** : ${href}\n`,
      "```",
      JSON.stringify(debugData, null, 2),
      "```",
      `\n\n---\n\n## Description\n`,
      description,
    ].join("\n"),
  });

  return { url: response.data.html_url };
};
