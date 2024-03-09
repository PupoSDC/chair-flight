import { QuestionBank } from "@cf/providers/question-bank";
import { Client } from "./client";
import type { FunctionComponent } from "react";

const Page: FunctionComponent = async () => {
  const prep = new QuestionBank("prep");
  const atpl = new QuestionBank("atpl");
  const type = new QuestionBank("type");
  const numberOfFlashcards = (await prep.getAll("flashcards")).length;
  const numberOfAtplQuestions = (await atpl.getAll("questions")).length;
  const numberOfTypeQuestions = (await type.getAll("questions")).length;

  return (
    <Client
      numberOfFlashcards={numberOfFlashcards}
      numberOfAtplQuestions={numberOfAtplQuestions}
      numberOfTypeQuestions={numberOfTypeQuestions}
    />
  );
};

export default Page;
