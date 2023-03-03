import { Box, Button, Sheet, styled } from '@mui/joy';
import React from 'react';
import { default as ReactMarkdown } from 'react-markdown';
import { default as remarkGfm } from 'remark-gfm';
import { getOptionColor } from './question-box-get-option-color';

const QuestionBoxSheet = styled(Sheet)`` as typeof Sheet;

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
      <QuestionBoxSheet component="section">
        <Box>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown>
        </Box>
        <Box>
          {options.map(({ optionId, text }) => {
            const [variant, color] = getOptionColor({
              correctOptionId,
              selectedOptionId,
              status,
              optionId,
            });

            return (
              <Button
                fullWidth
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
