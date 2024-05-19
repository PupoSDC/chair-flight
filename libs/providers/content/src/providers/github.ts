import { Octokit } from "octokit";
import { default as YAML } from "yaml";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { getRandomId } from "@cf/base/utils";
import type { EditQuestionsPr, NewIssue, QuestionTemplate} from "@cf/core/content";
import { questionTemplateSchema } from "@cf/core/content";

export class Github  {
  private static octokit: Octokit;
  private projectOwner: string;
  private projectRepo: string;

  constructor() {
    const auth = getEnvVariableOrThrow("PROVIDER_GITHUB_TOKEN");
    this.projectOwner = getEnvVariableOrThrow("PROVIDER_GITHUB_PROJECT_OWNER");
    this.projectRepo = getEnvVariableOrThrow("PROVIDER_GITHUB_PROJECT_REPO");
    Github.octokit ??= new Octokit({ auth });
  }

  private normalizePath(src: string) {
    return src.replace(/\\/g, "/").replace(/^\//, "");
  }

  public getRepositoryUrl() {
    return `https://github.com/${this.projectOwner}/${this.projectRepo}`;
  }

  public async createEditQuestionsPr(changes: EditQuestionsPr) {
    const octokit = Github.octokit;
    const prId = getRandomId();
    const baseBranch = "main";
    const newBranch = `feat-edit-questions-${changes.questionBank}-${prId}`;
    const deletedIds = changes.deletedQuestions.map((id) => id.toString());

    const baseBranchRef = await octokit.rest.git.getRef({
      owner: this.projectOwner,
      repo: this.projectRepo,
      ref: `heads/${baseBranch}`,
    });

    const newBranchRef = await octokit.rest.git.createRef({
      owner: this.projectOwner,
      repo: this.projectRepo,
      ref: `refs/heads/${newBranch}`,
      sha: baseBranchRef.data.object.sha,
    });

    const currentCommit = await octokit.rest.git.getCommit({
      owner: this.projectOwner,
      repo: this.projectRepo,
      commit_sha: newBranchRef.data.object.sha,
    });

    const srcLocations = [
      ...new Set([
        ...changes.questions.map((q) => this.normalizePath(q.srcLocation)),
        ...changes.questions.map((q) => this.normalizePath(q.srcLocation)),
      ]),
    ];

    const githubQuestions: QuestionTemplate[] = [];
    for (const srcLocation of srcLocations) {
      const getContentResponse = await octokit.rest.repos.getContent({
        owner: this.projectOwner,
        repo: this.projectRepo,
        path: srcLocation,
        ref: baseBranchRef.data.object.sha,
        mediaType: {
          format: "raw",
        },
      });

      const assumedString = getContentResponse.data as unknown as string;
      const assumedArray = JSON.parse(assumedString);
      const newQuestions = questionTemplateSchema.array().parse(assumedArray);
      githubQuestions.push(...newQuestions);
    }

    const modifiedQuestions = githubQuestions
      .map((q) => {
        const deleted = deletedIds.includes(q.id);
        if (deleted) return null;

        const newQuestion = changes.questions.find((sq) => sq.id === q.id);
        if (newQuestion) return newQuestion;

        return q;
      })
      .filter(Boolean);

    const newFileContents = modifiedQuestions.reduce(
      (acc, q) => {
        const srcLocation = this.normalizePath(q.srcLocation);
        acc[srcLocation] ??= [];
        acc[srcLocation].push(q);
        return acc;
      },
      {} as Record<string, QuestionTemplate[]>,
    );

    const newFiles = Object.keys(newFileContents).map((srcLocation) => {
      const newFile = JSON.stringify(newFileContents[srcLocation], null, 2);
      return { srcLocation, newFile };
    });

    const newTree = await octokit.rest.git.createTree({
      owner: this.projectOwner,
      repo: this.projectRepo,
      base_tree: currentCommit.data.tree.sha,
      tree: newFiles.map(({ srcLocation, newFile }) => ({
        path: srcLocation,
        mode: "100644",
        type: "blob",
        content: newFile,
      })),
    });

    const title = `content(${changes.questionBank}): ${changes.meta.title}`;
    const body = [
      "Automatic PR generated by Chair Flight.",
      "",
      "## User Provided context",
      "",
      `> ### ${changes.meta.title ?? "No title provided"}`,
      "",
      ...changes.meta.description.split("\n").map((line) => `> ${line}`),
      "",
    ].join("\n");

    const newCommit = await octokit.rest.git.createCommit({
      owner: this.projectOwner,
      repo: this.projectRepo,
      author: {
        name: changes.meta.authorName || "Chair Flight Bot",
        email: changes.meta.email || "bot@cf.com",
      },
      message: `${title}\n\n${body}`,
      tree: newTree.data.sha,
      parents: [currentCommit.data.sha],
    });

    await octokit.rest.git.updateRef({
      owner: this.projectOwner,
      repo: this.projectRepo,
      ref: `heads/${newBranch}`,
      sha: newCommit.data.sha,
    });

    const response = await octokit.rest.pulls.create({
      owner: this.projectOwner,
      repo: this.projectRepo,
      head: this.projectOwner + ":" + newBranch,
      base: baseBranch,
      title,
      body,
      author: {
        name: "Chair Flight Bot",
        email: "bot@cf.com",
      },
    });

    return { url: response.data.html_url };
  }

  public async createNewIssue(newIssue: NewIssue) {
    const { title, description, debugData, href } = newIssue;

    const response = await Github.octokit.rest.issues.create({
      owner: this.projectOwner,
      repo: this.projectRepo,
      title: `[App Bug Report] ${title}`,
      body: [
        "## Description\n",
        description,
        "\n---\n",
        "## Data\n",
        `\n**href** : ${href}`,
        "```yaml",
        YAML.stringify(debugData),
        "```",
      ].join("\n"),
    });

    return { url: response.data.html_url };
  }
}
