import { useState } from "react";
import { Flashcard } from "@chair-flight/react/components";
import type { QuestionBankFlashcardContent } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export const FlashcardWithOwnControl: FunctionComponent<
  QuestionBankFlashcardContent
> = (props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <Flashcard
      {...props}
      sx={{ width: "100%", height: "100%" }}
      flipped={isFlipped}
      onFlip={() => setIsFlipped(!isFlipped)}
    />
  );
};
