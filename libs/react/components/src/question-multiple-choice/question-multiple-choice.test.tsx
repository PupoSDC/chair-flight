import { render, screen } from "@testing-library/react";
import { QuestionMultipleChoice } from "./question-multiple-choice";

describe("QuestionMultipleChoice", () => {
  it("renders without crashing", () => {
    render(
      <QuestionMultipleChoice
        question="What is your name?"
        correctOptionId={"123"}
        selectedOptionId={"123"}
        status={"in-progress"}
        options={[
          { optionId: "123", text: "John" },
          { optionId: "456", text: "Jane" },
          { optionId: "789", text: "Jack" },
          { optionId: "102", text: "Jill" },
        ]}
      />
    );

    expect(screen.getByText("What is your name?")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Jack")).toBeInTheDocument();
    expect(screen.getByText("Jill")).toBeInTheDocument();
  });
});
