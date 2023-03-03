import { Question } from './types';

type CommonProps = Pick<Question, 'id' | 'version' | 'learningObjectives'>;

export const mergeQuestionVariants = <T extends CommonProps>(
  props: T,
  ...args: Array<(props: T) => Question[]>
): Question[] => {
  return args
    .map((arg) => arg(props))
    .flat()
    .map((e, i) => ({
      ...e,
      variant: i,
    }));
};
