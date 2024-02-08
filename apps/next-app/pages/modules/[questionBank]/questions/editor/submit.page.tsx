import * as fs from "node:fs/promises";
import { Box, Divider, Stack, Typography } from "@mui/joy";
import { AppHead } from "@chair-flight/react/components";
import {
  LayoutModule,
  QuestionEditorDiff,
  QuestionEditorManager,
  QuestionEditorSubmitForm,
} from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { GetStaticPaths, NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
};

type PageParams = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Questions", `/modules/${questionBank}/questions`],
    ["Editor", `/modules/${questionBank}/questions/editor`],
    "Submit",
  ] as Breadcrumbs;

  return (
    <LayoutModule
      questionBank={questionBank}
      breadcrumbs={crumbs}
      fixedHeight
      sx={{ flexDirection: "row", gap: 2 }}
    >
      <AppHead />
      <Stack sx={{ flex: 1 }}>
        <Typography level="h2">Submit a Change to Chair Flight</Typography>
        <Box sx={{ height: "100%", overflow: "auto" }}>
          <Typography level="body-sm">
            By completing the following steps you will open a Pull Request on
            GitHub. The Pull Request will be reviewed by a member of the Chair
            Flight team and if approved, the changes will be merged into the
            application and be available for all our users.
            <br />
            <br />
            To make this process a bit easier please supply a short title and
            description of the changes you made. You can optionally provide your
            e-mail so that the changes are properly credited to yourself!
          </Typography>

          <Divider sx={{ my: 2 }} />

          <QuestionEditorSubmitForm noSsr />
        </Box>
      </Stack>
      <Stack sx={{ flex: 1 }}>
        <Typography level="h2">Changes</Typography>
        <QuestionEditorDiff
          noSsr
          questionBank={questionBank}
          sx={{ height: "100%", overflow: "auto" }}
        />
      </Stack>
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await QuestionEditorManager.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["type", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
