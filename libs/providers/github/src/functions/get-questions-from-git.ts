import { z } from "zod";
import { NotFoundError } from "@chair-flight/base/errors";
import { questionSchema } from "@chair-flight/core/schemas";
import { getOctokit } from "../config/oktokit";
import type { QuestionTemplate } from "@chair-flight/base/types";

export const getQuestionsFromGit = async ({
  srcLocation,
  baseBranch = "main",
}: {
  srcLocation: string;
  baseBranch?: string;
}): Promise<QuestionTemplate[]> => {
  const { octokit, owner, repo } = getOctokit();
  const path = srcLocation.replace(/^\//, "");

  const baseBranchRef = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });

  const getContentResponse = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: srcLocation,
    ref: baseBranchRef.data.object.sha,
    mediaType: {
      format: "raw",
    },
  });

  const assumedString = getContentResponse.data as unknown as string;
  const assumedArray = JSON.parse(assumedString) as QuestionTemplate[];
  const arrayWithSrc = assumedArray.map((q) => ({ ...q, srcLocation: path }));
  return z.array(questionSchema).parse(arrayWithSrc);
};

export const getQuestionFromGit = async ({
  srcLocation,
  questionId,
  baseBranch = "main",
}: {
  srcLocation: string;
  questionId: string;
  baseBranch?: string;
}): Promise<QuestionTemplate> => {
  const questionsFromGit = await getQuestionsFromGit({
    srcLocation,
    baseBranch,
  });

  const questionTemplate = questionsFromGit.find((q) => q.id === questionId);

  if (!questionTemplate) {
    throw new NotFoundError(`Question ${questionId} not found in git`);
  }

  return questionTemplate;
};
