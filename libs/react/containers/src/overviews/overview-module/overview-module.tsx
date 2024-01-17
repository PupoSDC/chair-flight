import { useState } from "react";
import { Button, Divider, Grid, Typography } from "@mui/joy";
import { CtaSearch } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { LayoutModule } from "../../layouts/layout-module";
import { container, getRequiredParam } from "../../wraper";
import type { QuestionBankName } from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  hasFlashcards: boolean;
  hasQuestions: boolean;
  hasLearningObjectives: boolean;
  hasMedia: boolean;
};

export const OverviewModule = container<Props, Params, Data>(
  ({ questionBank, sx, component = "section" }) => {
    const config = LayoutModule.useData({ questionBank });
    const [searchQuestion, setQuestionSearch] = useState("");

    return (
      <Grid container component={component} sx={sx} spacing={2}>
        {config.hasQuestions && (
          <>
            <Grid xs={12} md={6}>
              <Button>Search Questions</Button>
            </Grid>
            <Grid xs={12} md={6}>
              <Button>Something Tests</Button>
            </Grid>
            <Grid xs={12} md={6}>
              <Button>Create Test</Button>
            </Grid>
          </>
        )}
        {config.hasQuestions && (
          <Grid xs={12} md={6}>
            <Typography level="h2">Search Questions</Typography>
            <Divider sx={{ mb: 2 }} />
            <CtaSearch
              disableLabel
              value={searchQuestion}
              onChange={(v) => setQuestionSearch(v)}
            />
          </Grid>
        )}
      </Grid>
    );
  },
);

OverviewModule.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  return await helper.questionBank.getConfig.fetch({ questionBank });
};

OverviewModule.useData = (params) => {
  const qb = trpc.questionBank;
  const questionBank = getRequiredParam(params, "questionBank");
  return qb.getConfig.useSuspenseQuery({ questionBank })[0];
};
