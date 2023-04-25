export const generateQuestionsForNavigation = (
  count: number,
  filled: number
) => {
  return [...Array(count).keys()].map((id) => ({
    id: `${id}`,
    correctOption: `${Math.floor(Math.random() * 2)}`,
    selectedOption:
      id < filled ? `${Math.floor(Math.random() * 2)}` : undefined,
  }));
};
