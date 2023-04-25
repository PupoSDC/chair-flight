import { useMemo, useState } from "react";
import { Box, Button, Link, Sheet, Typography } from "@mui/joy";
import { default as RenderIfVisible } from "react-render-if-visible";
import {
  getQuestion,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import {
  HEADER_HEIGHT,
  CountUp,
  QuestionMultipleChoice,
} from "@chair-flight/react/components";
import type { FunctionComponent } from "react";
import type { QuestionTemplate } from "@chair-flight/base/types";

export type QuestionPreviewProps = {
  numberOfQuestions: number;
  questionTemplate: QuestionTemplate;
};

export const QuestionPreview: FunctionComponent<QuestionPreviewProps> = ({
  numberOfQuestions,
  questionTemplate,
}) => {
  const [seed, setSeed] = useState("some random seed");
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const shuffler = useMemo(() => getRandomShuffler(seed), [seed]);

  const variantId = useMemo(
    () => shuffler(Object.values(questionTemplate.variants))[0].id,
    [shuffler, questionTemplate.variants]
  );

  const question = useMemo(
    () => getQuestion(questionTemplate, { variantId, seed }),
    [variantId, questionTemplate, seed]
  );

  const options = question.options.map((option) => ({
    optionId: option.id,
    text: option.text,
  }));

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          pr: 2,
          mb: 2,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Typography level="h2" sx={{ fontWeight: 900 }}>
          {`Explore `}
          <RenderIfVisible visibleOffset={0} rootElement={"span"} stayRendered>
            <CountUp
              component={"b"}
              end={numberOfQuestions}
              duration={2000}
              sx={{
                color: "primary.500",
                width: "3.2em",
                display: "inline-flex",
                justifyContent: "flex-end",
              }}
            />
          </RenderIfVisible>
          {` questions`}
          <br />
          {`In infinite combinations`}
        </Typography>
        <Typography level="h4" component="p" sx={{ mt: 2 }}>
          Chair Flight&apos;s questions are organized into variants, enabling
          you to practice challenging questions repeatedly and promptly skip
          variants of questions you already comprehend.
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            pt: 2,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Button
            size="lg"
            sx={{
              mr: 2,
              display: { xs: "none", sm: "flex" },
            }}
            children={"Get another variant!"}
            onClick={() => {
              setSeed(getRandomId());
              setLoading(true);
              setSelectedOptionId(undefined);
              setTimeout(() => setLoading(false), 250);
            }}
          />
          <Button
            size="lg"
            component={Link}
            variant="outlined"
            children={"Explore Questions"}
            href="/questions"
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: { xs: "none", sm: "flex" },
          pr: 2,
          mb: 2,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Sheet variant="outlined" sx={{ width: "100%", p: 2 }}>
          <QuestionMultipleChoice
            sx={{ width: "100%" }}
            loading={loading}
            status={selectedOptionId ? "show-result" : "in-progress"}
            question={question.question}
            options={options}
            correctOptionId={question.correctOptionId}
            selectedOptionId={selectedOptionId}
            onOptionClicked={setSelectedOptionId}
          />
        </Sheet>
      </Box>
    </Box>
  );
};
