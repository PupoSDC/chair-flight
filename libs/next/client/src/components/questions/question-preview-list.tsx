import { default as KeyboardArrowRightRoundedIcon } from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, Button, Link, List } from "@mui/joy";
import { QuestionVariantPreview } from "@chair-flight/react/components";
import type { QuestionPreview } from "@chair-flight/core/app";
import type { ListProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type QuestionPreviewListProps = {
  questions: QuestionPreview[];
} & Pick<ListProps, "sx">;

export const QuestionPreviewList: FunctionComponent<
  QuestionPreviewListProps
> = ({ questions, sx }) => {
  return (
    <List
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        overflow: "scroll",
        ...sx,
      }}
    >
      {questions.map((result) => (
        <Box
          data-cy="question-preview"
          component="li"
          sx={{
            px: { xs: 0, md: 1 },
            py: 1,
            width: { xs: 1, md: 1 / 2, lg: 1 / 3 },
          }}
          key={result.variantId}
        >
          <QuestionVariantPreview
            showCorrect
            id={result.questionId}
            variantId={`${result.variantId} ${
              result.numberOfVariants > 1
                ? `(+${+result.numberOfVariants - 1})`
                : ""
            }`}
            text={result.text}
            learningObjectives={result.learningObjectives}
            externalIds={result.externalIds}
            highLightTerms={[]}
            topRightCorner={
              <>
                <Button
                  size="sm"
                  variant="plain"
                  href={`/questions/${result.questionId}`}
                  component={Link}
                  children={"Go To Question"}
                  endDecorator={<KeyboardArrowRightRoundedIcon />}
                  sx={{
                    px: 1,
                    display: { xs: "none", sm: "flex" },
                  }}
                />
                <Button
                  size="sm"
                  variant="plain"
                  href={`/questions/${result.questionId}`}
                  component={Link}
                  children={<KeyboardArrowRightRoundedIcon />}
                  sx={{
                    px: 1,
                    display: { xs: "flex", sm: "none" },
                  }}
                />
              </>
            }
          />
        </Box>
      ))}
    </List>
  );
};
