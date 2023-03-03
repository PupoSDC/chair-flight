import { questionBasic, dedent } from '@chair-flight/chair-flight-question-bank-framework';

export const QJ5E83D02M = questionBasic({
  id: 'QJ5E83D02M',
  version: 1,
  learningObjectives: ['010.01'],
  question: dedent`Which statement is correct?`,
  options: [
    {
      id: 'QJ5E83D02M-0',
      why: '',
      correct: true,
      text: dedent`
        Spoiler extension increases the stall speed, the minimum rate of descent 
        and the minimum angle of descent.
      `,
    },
    {
      id: 'QJ5E83D02M-1',
      why: '',
      correct: false,
      text: dedent`
        Flap extension reduces the stall speed, which increases the maximum 
        glide distance.
      `,
    },
    {
      id: 'QJ5E83D02M-2',
      why: '',
      correct: false,
      text: dedent`
        Flap extension has no effect on the minimum rate of descent as this is 
        only affected by TAS.
      `,
    },
    {
      id: 'QJ5E83D02M-3',
      why: '',
      correct: false,
      text: dedent`
        Flap extension reduces the maximum lift/drag ratio thus reducing the 
        minimum rate of descent.
      `,
    },
  ],
  annexes: [],
  explanation: dedent``,
  externalIds: [],
});
