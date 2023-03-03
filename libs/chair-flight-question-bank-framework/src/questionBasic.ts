import { Question } from './types';

export const questionBasic = (
  props: Omit<Question, 'variant' | 'correct'>
): [Question] => [
  {
    variant: 0,
    ...props,
    correct: props.options.find((q) => q.correct)?.id ?? '',
  },
];
