import { QuestionBox } from './question-box';

export default {
  title: 'Question Box',
  component: QuestionBox,
};

const primaryArgs = {
  question: 'question ? ',
  correctOptionId: 'correctOptionId',
  selectedOptionId: 'selectedOptionId',
  status: 'status',
  options: [
    {
      optionId: 'id',
      text: 'label',
    },
  ],
};

export const Example = {
  args: {
    ...primaryArgs,
  },
};
