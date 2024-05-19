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
          { id: "123", text: "John" },
          { id: "456", text: "Jane" },
          { id: "789", text: "Jack" },
          { id: "102", text: "Jill" },
        ]}
      />,
    );

    expect(screen.getByText("What is your name?")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Jack")).toBeInTheDocument();
    expect(screen.getByText("Jill")).toBeInTheDocument();
  });
});
