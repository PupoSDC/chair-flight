export const getOptionColor = ({
  status,
  optionId,
  selectedOptionId,
  correctOptionId,
}: {
  status: 'in-progress' | 'show-result';
  selectedOptionId: string;
  correctOptionId: string;
  optionId: string;
}): ['plain' | 'outlined', 'primary' | 'success' | 'danger' | 'neutral'] => {
  if (status === 'in-progress') {
    if (selectedOptionId === optionId) {
      return ['plain', 'primary'];
    } else {
      return ['outlined', 'primary'];
    }
  } else {
    if (selectedOptionId === optionId) {
      if (correctOptionId === optionId) {
        return ['plain', 'success'];
      } else {
        return ['outlined', 'danger'];
      }
    } else if (correctOptionId === optionId) {
      return ['outlined', 'success'];
    } else {
      return ['outlined', 'neutral'];
    }
  }
};
