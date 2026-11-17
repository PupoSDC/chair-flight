import { useState } from "react";
import { QuestionMultipleChoice } from "../../libs/ui/components/tests/question-multiple-choice";
import type { FC } from "react";

const OPTIONS = [
  { id: "a", text: "1100 psi" },
  { id: "b", text: "1850 psi" },
  { id: "c", text: "3000 psi" },
  { id: "d", text: "1000 psi" },
];

export const QuestionMultipleChoiceStory: FC = () => {
  const [selected, setSelected] = useState<string>();

  return (
    <div className="max-w-2xl">
      <QuestionMultipleChoice
        question="What is the flight crew maximum oxygen pressure for the first flight of the day?"
        options={OPTIONS}
        annexes={[
          "/content/annexes/atpl/031-mrjt-load-trim-sheet.svg?dryOperatingMass=34900&takeOffFuel=9500&tripFuel=6500",
          "/content/annexes/atpl/buffet-onset-boundary-chart.svg",
        ]}
        selectedOptionId={selected}
        correctOptionId="b"
        showResult={Boolean(selected)}
        disabled={Boolean(selected)}
        onOptionClick={setSelected}
      />
    </div>
  );
};
