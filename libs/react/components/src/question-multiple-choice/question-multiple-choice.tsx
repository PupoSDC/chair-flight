import { forwardRef } from "react";
import { Box, Button, styled } from "@mui/joy";
import { MarkdownClient } from "../markdown-client";
import { Skeleton } from "../skeleton";
import { getOptionColor } from "../utils/get-question-status-color";
import type { BoxProps } from "@mui/joy";

const QuestionMultipleChoiceBox = styled(Box)`
  padding: ${({ theme }) => theme.spacing(0)};
  .options-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
` as typeof Box;

const QuestionMultipleChoiceOption = styled(Button)`
  margin: ${({ theme }) => theme.spacing(0.5, 0)};
  padding: ${({ theme }) => theme.spacing(1)};
  text-align: left;
  justify-content: flex-start;

  ${({ theme }) => theme.breakpoints.up("sm")} {
    margin: ${({ theme }) => theme.spacing(1, 0)};
    padding: ${({ theme }) => theme.spacing(2)};
  }

  &,
  &:disabled {
    color: ${({ theme, variant, color = "primary" }) => {
      if (variant === "outlined" && color === "primary") {
        return theme.vars.palette.text.primary;
      }
      if (variant === "solid") {
        return theme.vars.palette[color].solidColor;
      }
      return theme.vars.palette[color].solidBg;
    }};
    background-color: ${({ theme, variant = "solid", color = "primary" }) => {
      if (variant === "solid") {
        return theme.vars.palette[color].solidBg;
      }
      return "initial";
    }};
    border-color: ${({ theme, variant = "solid", color = "primary" }) => {
      if (variant === "solid") {
        return theme.vars.palette[color].solidBg;
      }
      return "initial";
    }};
  }

  & .MuiButton-startDecorator {
    font-size: 2.5em;
    color: ${({ theme, variant, color = "primary" }) =>
      variant === "outlined"
        ? theme.vars.palette[color].solidBg
        : theme.vars.palette.primary.solidColor};

    ${({ theme }) => theme.breakpoints.up("sm")} {
      padding-right: ${({ theme }) => theme.spacing(1)};
    }
  }
  &.Joy-disabled {
  }
`;
export type QuestionMultipleChoiceStatus = "in-progress" | "show-result";

export type QuestionMultipleChoiceProps = {
  question?: string;
  options?: Array<{ optionId: string; text: string }>;
  status?: QuestionMultipleChoiceStatus;
  correctOptionId?: string;
  selectedOptionId?: string;
  hideIrrelevant?: boolean;
  loading?: boolean;
  disabled?: boolean;
  annexes?: string[];
  onAnnexClicked?: (annexId: string) => void;
  onOptionClicked?: (optionId: string) => void;
} & Pick<BoxProps, "component" | "sx" | "className">;

export const QuestionMultipleChoice = forwardRef<
  HTMLDivElement,
  QuestionMultipleChoiceProps
>(
  (
    {
      question = "",
      correctOptionId,
      selectedOptionId,
      status = "in-progress",
      loading,
      hideIrrelevant,
      options = [],
      disabled,
      annexes,
      onAnnexClicked,
      onOptionClicked,
      ...others
    },
    ref,
  ) => (
    <QuestionMultipleChoiceBox ref={ref} {...others}>
      <Box className="question-text-container">
        {loading ? (
          <>
            <Skeleton sx={{ height: "3em", width: "100%", mb: 1, mt: 2 }} />
            <Skeleton sx={{ height: "1em", width: "85%", my: 1 }} />
            <Skeleton sx={{ height: "2em", width: "100%", my: 1 }} />
            <Skeleton sx={{ height: "1em", width: "50%", my: 1 }} />
          </>
        ) : (
          <>
            <MarkdownClient>{question}</MarkdownClient>
            <Box>
              {annexes?.map((annexUrl) => (
                <Button
                  key={annexUrl}
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => onAnnexClicked?.(annexUrl)}
                >
                  <img src={annexUrl} alt="annex" width={40} height={40} />
                </Button>
              ))}
            </Box>
          </>
        )}
      </Box>
      <Box className="options-container">
        {options.map(({ optionId, text }, index) => {
          if (loading)
            return (
              <QuestionMultipleChoiceOption
                key={optionId}
                fullWidth
                variant="outlined"
                color="primary"
                children={
                  <Skeleton sx={{ height: "2em", width: "100%", my: 1 }} />
                }
              />
            );

          const isRelevantOption = [correctOptionId, selectedOptionId].includes(
            optionId,
          );

          if (hideIrrelevant && status === "show-result" && !isRelevantOption) {
            return null;
          }

          const [variant, color] = getOptionColor({
            correctOptionId,
            selectedOptionId,
            status,
            optionId,
          });
          return (
            <QuestionMultipleChoiceOption
              fullWidth
              startDecorator={String.fromCharCode(65 + index)}
              disabled={disabled}
              key={optionId}
              variant={variant}
              children={text}
              color={color}
              onClick={() => onOptionClicked?.(optionId)}
            />
          );
        })}
      </Box>
    </QuestionMultipleChoiceBox>
  ),
);
