"use client";

import { useState } from "react";
import { Flashcard } from "./flashcard";
import type { FlashcardProps } from "./flashcard";
import type { FunctionComponent } from "react";

export type FlashcardWithOwnControlProps = Omit<
  FlashcardProps,
  "flipped" | "onFlip"
>;

export const FlashcardWithOwnControl: FunctionComponent<
  FlashcardWithOwnControlProps
> = (props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <Flashcard
      {...props}
      flipped={isFlipped}
      onFlip={() => setIsFlipped(!isFlipped)}
    />
  );
};
