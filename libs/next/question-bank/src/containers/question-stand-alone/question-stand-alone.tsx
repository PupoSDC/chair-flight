import { useState } from "react";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import { Button, Stack } from "@mui/joy";
import { getRandomId } from "@chair-flight/base/utils";
import {
  ImageViewer,
  QuestionMultipleChoice,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import { MarkdownFromServer } from "../../components/markdown-from-server";
import type {
  QuestionBankName,
  QuestionTemplateId,
} from "@chair-flight/core/question-bank";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus as Status,
} from "@chair-flight/react/components";
import type { CommonComponentProps } from "@chair-flight/trpc/client";
import type { AppRouterOutput } from "@chair-flight/trpc/client";
import type { FunctionComponent } from "react";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

type Props = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
  seed: string;
  onNavigateToNewSeed?: (args: { seed: string }) => void;
};

type Params = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
  seed: string;
};

type Data = AppRouterOutput["containers"]["questions"]["getQuestionStandAlone"];

export const QuestionStandAloneComponent: FunctionComponent<
  CommonComponentProps & Props & Data
> = ({ sx, component = "section", question, annexes, onNavigateToNewSeed }) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<Status>("in-progress");
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

  const navigateToNewSeed = (seed: string) => {
    setSelectedOption(undefined);
    setSelectedStatus("in-progress");
    onNavigateToNewSeed?.({ seed });
  };

  return (
    <Stack component={component} sx={{ display: "relative", ...sx }}>
      <QuestionMultipleChoice
        sx={{ width: "100%" }}
        question={<MarkdownFromServer children={question.question} />}
        correctOptionId={question.correctOptionId}
        selectedOptionId={selectedOption}
        status={selectedStatus}
        disabled={selectedStatus === "show-result"}
        options={question.options}
        annexesHref={annexes.map((annex) => annex.href)}
        onOptionClicked={(optionId) => {
          setSelectedOption(optionId);
          setSelectedStatus("show-result");
        }}
        onAnnexClicked={(annex) => {
          setCurrentAnnex(annex);
        }}
      />
      <ImageViewer
        open={currentAnnex !== undefined}
        onClose={() => setCurrentAnnex(undefined)}
        drawings={annexDrawings[currentAnnex ?? ""] ?? []}
        onDrawingsChanged={(newDrawings) =>
          setAnnexDrawings((oldDrawings) => ({
            ...oldDrawings,
            [currentAnnex ?? ""]: newDrawings,
          }))
        }
        onUndo={() =>
          setAnnexDrawings((old) => ({
            ...old,
            [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(0, -1),
          }))
        }
        onReset={() =>
          setAnnexDrawings((old) => ({
            ...old,
            [currentAnnex ?? ""]: [],
          }))
        }
        imgSrc={currentAnnex ?? ""}
      />
      <Button
        children={<RefreshIcon />}
        onClick={() => navigateToNewSeed(getRandomId())}
        sx={{
          width: (theme) => theme.spacing(5),
          height: (theme) => theme.spacing(5),
          borderRadius: "50%",
          position: "absolute",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
      />
    </Stack>
  );
};

export const QuestionStandAlone = container<Props, Params, Data>((props) => {
  const params = QuestionStandAlone.useData(props);
  return <QuestionStandAloneComponent {...props} {...params} />;
});

QuestionStandAlone.displayName = "QuestionStandAlone";

QuestionStandAlone.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  const seed = getRequiredParam(params, "seed");
  return await router.getQuestionStandAlone.fetch({
    questionBank,
    questionId,
    seed,
  });
};

QuestionStandAlone.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  const seed = getRequiredParam(params, "seed");
  return router.getQuestionStandAlone.useSuspenseQuery({
    questionBank,
    questionId,
    seed,
  })[0];
};

QuestionStandAlone.LoadingFallback = ({ sx }) => (
  <Stack sx={sx}>
    <QuestionMultipleChoice loading />
  </Stack>
);
