export type QuestionTemplate =
  | {
      type: "simple";
      question: string;
      explanation: string;
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
      explanation: string;
      answer: boolean;
    }
  | {
      type: "one-two";
      question: string;
      explanation: string;
      firstCorrectStatements: string[];
      firstIncorrectStatements: string[];
      secondCorrectStatements: string[];
      secondIncorrectStatements: string[];
    }
  | {
      type: "definition";
      question: string;
      explanation: string;
      showOptionExplanations?: boolean;
      options: {
        id: string;
        term: string;
        annex?: string;
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
      explanation: string;
      options: {
        text: string;
        correct: boolean;
        why: string;
      }[];
    }
  | {
      type: "calculation";
      question: string;
      explanation: string;
      variables: {
        id: string;
        label: string;
        unit: string;
      }[];
      answer?: {
        formula: string;
        unit: string;
        decimals: number;
        format?: string;
        optionText?: string;
        second?: {
          formula: string;
          unit: string;
          decimals: number;
          format?: string;
        };
      };
      distractors?: {
        id: string;
        formula: string;
        second?: string;
      }[];
      presets: {
        id: string;
        values: Record<string, number>;
        answer?: string;
        wrongAnswers?: string[];
        explanation?: string;
      }[];
    }
  | {
      type: "chart";
      question: string;
      explanation: string;
      variables: {
        id: string;
        label: string;
        unit: string;
      }[];
      entries: {
        id: string;
        values: Record<string, number>;
        answer: string;
        wrongAnswers: string[];
        explanation: string;
      }[];
    }
  | {
      type: "chart-calculation";
      question: string;
      explanation: string;
      variables: {
        id: string;
        label: string;
        unit: string;
      }[];
      chartInputs: string[];
      answer?: {
        formula: string;
        unit: string;
        decimals: number;
        format?: string;
        optionText?: string;
        second?: {
          formula: string;
          unit: string;
          decimals: number;
          format?: string;
        };
      };
      distractors?: {
        id: string;
        formula: string;
        second?: string;
      }[];
      presets: {
        id: string;
        values: Record<string, number>;
        answer?: string;
        wrongAnswers?: string[];
        explanation?: string;
      }[];
    }
  | {
      type: "mrjt";
      question: string;
      explanation: string;
      given: string[];
      answer: string;
      presets: {
        id: string;
        values: Record<string, number>;
        answer?: string;
        wrongAnswers?: string[];
        explanation?: string;
      }[];
    };
