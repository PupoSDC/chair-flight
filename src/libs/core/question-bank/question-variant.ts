export type QuestionVariant =
  | {
      type: "simple";
      question: string;
      options: {
        id: string;
        text: string;
        correct: boolean;
        why: string;
      }[];
    }
  | {
      type: "true-or-false";
      question: string;
      answer: boolean;
    }
  | {
      type: "one-two";
      question: string;
      firstCorrectStatements: string[];
      firstIncorrectStatements: string[];
      secondCorrectStatements: string[];
      secondIncorrectStatements: string[];
    }
  | {
      type: "definition";
      question: string;
      options: {
        id: string;
        term: string;
        definition: string;
      }[];
      fakeOptions: {
        id: string;
        definition: string;
      }[];
    }
  | {
      type: "multiple-correct";
      question: string;
      options: {
        text: string;
        correct: boolean;
        why: string;
      }[];
    };
