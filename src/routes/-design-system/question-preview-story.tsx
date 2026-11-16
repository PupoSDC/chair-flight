import { useState } from "react";
import { QuestionPreview } from "../../libs/ui/components/question-bank/question-preview";
import { StoryBlock } from "./story-block";
import type { FC } from "react";

export const QuestionPreviewStory: FC = () => {
  const [seed, setSeed] = useState(0);

  return (
    <StoryBlock title="Default">
      <div className="h-[640px] overflow-auto rounded-lg border border-rule">
        <QuestionPreview
          key={seed}
          questionBank="b737"
          question={{
            id: "STORY",
            question: "What is the flight crew maximum oxygen pressure?",
            options: [
              { id: "a", text: "1100 psi", why: "" },
              { id: "b", text: "1850 psi", why: "" },
              { id: "c", text: "3000 psi", why: "" },
              { id: "d", text: "1000 psi", why: "" },
            ],
            annexes: [],
            correctOptionId: "b",
            explanation: "The cylinder is filled to **1850 psi**.",
          }}
          relatedQuestions={[
            { id: "QRELATED", preview: "A related question." },
          ]}
          backLink={{ to: "/design-system/{-$story}" }}
          position={{ index: 3, total: 26 }}
          onPrevious={() => undefined}
          onNext={() => undefined}
          onRefresh={() => setSeed((value) => value + 1)}
          relatedQuestionLink={() => ({ to: "/design-system/{-$story}" })}
        />
      </div>
    </StoryBlock>
  );
};
