import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { getRandomId } from "@chair-flight/base/utils";
import { getOctokit } from "../config/oktokit";
import type { QuestionBankQuestionTemplate } from "@chair-flight/base/types";
import type { questionEditSchema } from "@chair-flight/core/schemas";
import type { z } from "zod";

export const createNewQuestionPr = async (
  schema: z.infer<typeof questionEditSchema>,
) => {
  const {
    question: { srcLocation, ...question },
    requestData,
  } = schema;
  const prId = getRandomId();
  const { octokit, originOwner, originRepo, upstreamOwner, upstreamRepo } =
    getOctokit();
  const baseBranch = "main";
  const newBranch = `feat-question-${question.id}-${prId}`;
  const normalizedSrcLocation = srcLocation
    .replace(/\\/g, "/")
    .replace(/^\//, "");

  const baseBranchRef = await octokit.rest.git.getRef({
    owner: originOwner,
    repo: originRepo,
    ref: `heads/${baseBranch}`,
  });

  const getContentResponse = await octokit.rest.repos.getContent({
    owner: originOwner,
    repo: originRepo,
    path: normalizedSrcLocation,
    ref: baseBranchRef.data.object.sha,
    mediaType: {
      format: "raw",
    },
  });

  const assumedString = getContentResponse.data as unknown as string;
  const assumedArray = JSON.parse(
    assumedString,
  ) as QuestionBankQuestionTemplate[];

  const newQuestions = assumedArray.map((q) =>
    q.id === question.id ? question : q,
  );

  const newFile = await format(JSON.stringify(newQuestions, null, 2), {
    parser: "json",
    plugins: [babelPlugin, estreePlugin],
  });

  const newBranchRef = await octokit.rest.git.createRef({
    owner: originOwner,
    repo: originRepo,
    ref: `refs/heads/${newBranch}`,
    sha: baseBranchRef.data.object.sha,
  });

  const currentCommit = await octokit.rest.git.getCommit({
    owner: originOwner,
    repo: originRepo,
    commit_sha: newBranchRef.data.object.sha,
  });

  const newTree = await octokit.rest.git.createTree({
    owner: originOwner,
    repo: originRepo,
    tree: [
      {
        path: normalizedSrcLocation,
        mode: "100644",
        type: "blob",
        content: newFile,
      },
    ],
    base_tree: currentCommit.data.tree.sha,
  });

  const title = `feat(question): update question ${question.id}`;
  const body = [
    "Automatic PR generated by Chair Flight.",
    "",
    "## User Provided context",
    "",
    `> ### ${requestData.title ?? "No title provided"}`,
    "",
    ...requestData.description.split("\n").map((line) => `> ${line}`),
    "",
  ].join("\n");

  const newCommit = await octokit.rest.git.createCommit({
    owner: originOwner,
    repo: originRepo,
    author: {
      name: requestData.authorName || "Chair Flight Bot",
      email: requestData.email || "bot@chair-flight.com",
    },
    message: `${title}\n\n${body}`,
    tree: newTree.data.sha,
    parents: [currentCommit.data.sha],
  });

  await octokit.rest.git.updateRef({
    owner: originOwner,
    repo: originRepo,
    ref: `heads/${newBranch}`,
    sha: newCommit.data.sha,
  });

  const response = await octokit.rest.pulls.create({
    owner: upstreamOwner,
    repo: upstreamRepo,
    head: originOwner + ":" + newBranch,
    base: baseBranch,
    title,
    body,
    author: {
      name: "Chair Flight Bot",
      email: "bot@chair-flight.com",
    },
  });

  return { url: response.data.html_url };
};
