import { forwardRef } from "react";
import { Box, Button, Skeleton, buttonClasses, styled } from "@mui/joy";
import { MarkdownClient } from "../markdown-client";
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
  font-weight: 400;
  margin: ${({ theme }) => theme.spacing(1, 0)};
  padding: ${({ theme }) => theme.spacing(1)};
  text-align: left;
  justify-content: flex-start;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: ${({ theme }) => theme.spacing(0.5, 0)};
    padding: ${({ theme }) => theme.spacing(1)};
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

  & .${buttonClasses.startDecorator} {
    font-size: 2.5em;
    padding-left: ${({ theme }) => theme.spacing(1)};
    padding-right: ${({ theme }) => theme.spacing(1)};
    color: ${({ theme, variant, color = "primary" }) =>
      variant === "outlined"
        ? theme.vars.palette[color].solidBg
        : theme.vars.palette.primary.solidColor};

    ${({ theme }) => theme.breakpoints.down("sm")} {
      padding-right: ${({ theme }) => theme.spacing(0)};
      font-size: 1.5em;
    }
  }

  &.${buttonClasses.sizeSm} {
    margin: ${({ theme }) => theme.spacing(0.5, 0)};
    padding: ${({ theme }) => theme.spacing(1)};

    & .${buttonClasses.startDecorator} {
      font-size: 1.2em;
    }
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
  compact?: boolean;
  disabled?: boolean;
  annexes?: string[];
  onAnnexClicked?: (annexId: string) => void;
  onOptionClicked?: (optionId: string) => void;
  component?: React.ElementType;
} & Pick<BoxProps, "sx" | "className">;

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
      compact,
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
      <Box>
        {loading ? (
          <>
            <Skeleton variant="text" sx={{ width: "100%" }} />
            <Skeleton variant="text" sx={{ width: "100%" }} />
            <Skeleton variant="text" sx={{ width: "85%", mb: 2 }} />
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
        {loading &&
          [1, 2, 3, 4].map((key) => (
            <Skeleton
              key={key}
              variant="rectangular"
              sx={{ height: compact ? "2em" : "4em", my: 1 }}
            />
          ))}
        {!loading &&
          options.map(({ optionId, text }, index) => {
            const isRelevantOption = [
              correctOptionId,
              selectedOptionId,
            ].includes(optionId);

            if (
              hideIrrelevant &&
              status === "show-result" &&
              !isRelevantOption
            ) {
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
                size={compact ? "sm" : "lg"}
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

QuestionMultipleChoice.displayName = "QuestionMultipleChoice";
