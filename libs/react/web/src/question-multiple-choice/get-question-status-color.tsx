export const getOptionColor = ({
  status,
  optionId,
  selectedOptionId,
  correctOptionId,
}: {
  status: "in-progress" | "show-result";
  selectedOptionId?: string;
  correctOptionId?: string;
  optionId: string;
}): ["solid" | "outlined", "primary" | "success" | "danger" | "neutral"] => {
  if (status === "in-progress") {
    if (selectedOptionId === optionId) {
      return ["solid", "primary"];
    } else {
      return ["outlined", "primary"];
    }
  } else {
    if (selectedOptionId === optionId) {
      if (correctOptionId === optionId) {
        return ["solid", "success"];
      } else {
        return ["solid", "danger"];
      }
    } else if (correctOptionId === optionId) {
      return ["outlined", "success"];
    } else {
      return ["outlined", "neutral"];
    }
  }
};
