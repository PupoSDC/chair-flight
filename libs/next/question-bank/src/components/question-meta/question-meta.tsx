import { Divider, Grid, Link, Sheet, Stack, Typography } from "@mui/joy";
import { getQuestionPreview } from "@cf/core/question-bank";
import { MdxRemote } from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import { LearningObjectiveSearch, QuestionSearch } from "@cf/providers/search";
import { Ups } from "@cf/react/ui";
import { SearchLearningObjectivesList } from "../search-learning-objectives";
import { SearchQuestionsList } from "../search-questions";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type QuestionMeta = {
  questionBank: QuestionBankName;
  questionId: string;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
};

export const QuestionMeta: FunctionComponent<QuestionMeta> = async ({
  questionBank,
  questionId,
  component = "div",
  sx,
}) => {
  const bank = new QuestionBank(questionBank);
  const loSearch = new LearningObjectiveSearch();
  const questionSearch = new QuestionSearch();
  const template = await bank.getOne("questions", questionId);
  const loIds = template.learningObjectives;
  const qIds = template.relatedQuestions;
  const externalIds = template.externalIds;
  const learningObjectives = await loSearch.retrieve(bank, loIds);
  const relatedQuestions = await questionSearch.retrieve(bank, qIds);
  const preview = getQuestionPreview(template.variant);

  return (
    <Stack component={component} sx={sx}>
      <Typography level="h2">Preview</Typography>
      <Divider />
      <MdxRemote source={preview} />

      <Typography level="h2" sx={{ mt: 4 }}>
        Explanation
      </Typography>
      <Divider />
      {template.explanation ? (
        <MdxRemote source={template.explanation} />
      ) : (
        <Ups message="No explanation to this question is available" />
      )}

      <Typography level="h2" sx={{ mt: 4 }}>
        Learning Objectives
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <SearchLearningObjectivesList
        currentCourse={"all"}
        items={learningObjectives.items}
        forceMode="mobile"
      />

      <Typography level="h2" sx={{ mt: 4 }}>
        Related Questions
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <SearchQuestionsList items={relatedQuestions.items} forceMode="mobile" />

      <Typography level="h2" sx={{ mt: 4 }}>
        External Ids
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Sheet sx={{ p: 1 }}>
        {externalIds.length > 0 ? (
          <Grid container>
            {externalIds.map((ref) => (
              <Grid key={ref} xs={6} md={3} lg={3}>
                <Link href={""} disabled>
                  <span>{ref}</span>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Ups message="No External References" />
        )}
      </Sheet>

      <Typography level="h2" sx={{ mt: 4 }}>
        Comments
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Sheet color="warning" sx={{ p: 2 }}>
        Question comments aren't available yet, but you can upvote{" "}
        <Link href="https://github.com/PupoSDC/chair-flight/issues/197">
          this GitHub issue
        </Link>{" "}
        to see it arrive sooner.
        <br />
        Don't hesitate to leave a comment there to influence what gets built
        next!
      </Sheet>
    </Stack>
  );
};
