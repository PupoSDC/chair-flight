import { QuestionBox } from '@chair-flight/chair-flight-components';

export const TestView = () => {
  return (
    <QuestionBox
      disabled
      question={'## hello world\n\nHello world 2'}
      correctOptionId={'1'}
      selectedOptionId={'3'}
      status={'show-result'}
      options={[
        {
          text: 'Some text',
          optionId: '1',
        },
        {
          text: 'Some text',
          optionId: '2',
        },
        {
          text: 'Some text',
          optionId: '3',
        },
        {
          text: 'Some text',
          optionId: '4',
        },
      ]}
    />
  );
};
