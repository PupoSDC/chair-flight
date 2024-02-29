import { default as YAML } from "yaml";
import { originOwner, originRepo } from "../common/env";
import type { NewIssue } from "@cf/core/github";
import type { Octokit } from "octokit";

export const createNewIssue = async (octokit: Octokit, newIssue: NewIssue) => {
  const { title, description, debugData, authorName } = newIssue;

  const response = await octokit.rest.issues.create({
    owner: originOwner,
    repo: originRepo,
    title: `[App Bug Report] ${title}`,
    body: [
      description,
      "\n---\n",
      "## Author\n",
      authorName,
      "\n---\n",
      "## Data\n",
      "<details>",
      "```yaml\n",
      YAML.stringify(debugData),
      "```",
      "</details>",
    ].join("\n"),
  });

  return { url: response.data.html_url };
};
