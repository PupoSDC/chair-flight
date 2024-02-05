import { originOwner, originRepo } from "../common/env";
import type { NewIssue } from "@chair-flight/core/github";
import type { Octokit } from "octokit";

export const createNewIssue = async (octokit: Octokit, newIssue: NewIssue) => {
  const { title, description, debugData, href } = newIssue;

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
