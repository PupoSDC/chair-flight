import { Box, Button } from "@mui/joy";
import axios from "axios";
import { NotFoundError } from "@chair-flight/base/errors";
import { getQuestionPreview } from "@chair-flight/core/app";
import { ssrHandler } from "@chair-flight/next/server";
import {
  AppLayout,
  QuestionVariantPreview,
  toast,
} from "@chair-flight/react/components";
import { getMerge } from "../api/questions/merge.api";
import type { MergeRequestBody } from "../api/questions/merge.api";
import type { NextPage } from "next";
import type { QuestionTemplate } from "@chair-flight/base/types";

export type MergePageProps = {
  q0: QuestionTemplate;
  q1: QuestionTemplate;
};

const MergePage: NextPage<MergePageProps> = ({ q0, q1 }) => {
  const sendResolution = async (resolution: MergeRequestBody["resolution"]) => {
    const body: MergeRequestBody = {
      q0: q0.id,
      q1: q1.id,
      resolution,
    };
    const promise = axios.post("/api/questions/merge", body);
    toast.promise(promise, {
      loading: "Merging...",
      error: "Error merging :(",
      success: () => {
        setTimeout(() => location.reload(), 0);
        return "Merged!";
      },
    });
  };

  return (
    <>
      <h1> Merge Page </h1>
      <AppLayout.Main>
        <Box sx={{ flexDirection: "row", margin: "auto" }}>
          <Button
            sx={{ m: 2 }}
            onClick={() => sendResolution("delete_left")}
            color="danger"
          >
            delete left
          </Button>
          <Button
            sx={{ m: 2 }}
            onClick={() => sendResolution("merge_left")}
            color="warning"
          >
            merge left
          </Button>
          <Button
            sx={{ m: 2 }}
            onClick={() => sendResolution("skip")}
            color="success"
          >
            skip
          </Button>
          <Button
            sx={{ m: 2 }}
            onClick={() => sendResolution("merge_right")}
            color="warning"
          >
            merge right
          </Button>
          <Button
            sx={{ m: 2 }}
            onClick={() => sendResolution("delete_right")}
            color="danger"
          >
            delete right
          </Button>
        </Box>
        <AppLayout.Grid>
          <AppLayout.Column xs={6}>
            {Object.values(q0.variants).map((v) => {
              return (
                <QuestionVariantPreview
                  id={q0.id}
                  key={v.id}
                  variantId={v.id}
                  text={getQuestionPreview(q0, v.id)}
                  learningObjectives={q0.learningObjectives}
                  externalIds={v.externalIds}
                />
              );
            })}
          </AppLayout.Column>
          <AppLayout.Column xs={6}>
            {Object.values(q1.variants).map((v) => {
              return (
                <QuestionVariantPreview
                  id={q1.id}
                  key={v.id}
                  variantId={v.id}
                  text={getQuestionPreview(q1, v.id)}
                  learningObjectives={q1.learningObjectives}
                  externalIds={v.externalIds}
                />
              );
            })}
          </AppLayout.Column>
        </AppLayout.Grid>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<MergePageProps>(
  async ({ questionBank }) => {
    const { q0, q1 } = await getMerge(questionBank);
    if (!q0 || !q1) throw new NotFoundError("No questions to merge :(");
    return {
      props: {
        q0,
        q1,
      },
    };
  }
);

export default MergePage;
