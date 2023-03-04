import { Box, Button, Sheet, styled } from '@mui/joy';
import React from 'react';
import { default as ReactMarkdown } from 'react-markdown';
import { default as remarkGfm } from 'remark-gfm';
import { getOptionColor } from './question-box-get-option-color';

const QuestionBoxSheet = styled(Sheet)`
  .options-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
` as typeof Sheet;

const QuestionBoxOption = styled(Button)`
  margin: ${({ theme }) => theme.spacing(1)} 0;
  text-align: left;
  justify-content: flex-start;

  && {
    color: ${({ theme, variant, color = 'primary' }) => {
      if (variant === 'outlined' && color === 'primary') {
        return theme.vars.palette.text.primary;
      }
      if (variant === 'solid') {
        return theme.vars.palette[color].solidColor;
      }
      return theme.vars.palette[color].solidBg;
    }};
    background-color: ${({ theme, variant = 'solid', color = 'primary' }) => {
      if (variant === 'solid') {
        return theme.vars.palette[color].solidBg;
      }
      return 'initial';
    }};
    border-color: ${({ theme, variant = 'solid', color = 'primary' }) => {
      if (variant === 'solid') {
        return theme.vars.palette[color].solidBg;
      }
      return 'initial';
    }};
  }

  & .MuiButton-startDecorator {
    font-size: 2em;
    color: ${({ theme, variant, color = 'primary' }) =>
      variant === 'outlined'
        ? theme.vars.palette[color].solidBg
        : theme.vars.palette.primary.solidColor};
  }

  &.Joy-disabled {
  }
`;

export type QuestionBoxProps = {
  question: string;
  correctOptionId: string;
  selectedOptionId: string;
  status: 'in-progress' | 'show-result';
  disabled?: boolean;
  options: Array<{
    optionId: string;
    text: string;
  }>;
};

export const QuestionBox = React.forwardRef<HTMLDivElement, QuestionBoxProps>(
  (
    { question, correctOptionId, selectedOptionId, status, options, disabled },
    ref
  ) => {
    return (
      <QuestionBoxSheet component="section" ref={ref}>
        <Box className="question-text-container">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown>
        </Box>
        <Box className="options-container">
          {options.map(({ optionId, text }, index) => {
            const [variant, color] = getOptionColor({
              correctOptionId,
              selectedOptionId,
              status,
              optionId,
            });

            return (
              <QuestionBoxOption
                fullWidth
                startDecorator={String.fromCharCode(65 + index)}
                disabled={disabled}
                key={optionId}
                variant={variant}
                children={text}
                color={color}
              />
            );
          })}
        </Box>
      </QuestionBoxSheet>
    );
  }
);
