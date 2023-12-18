import type { RouterInput } from "@chair-flight/trpc/client";

export type EditQuestionFormValues =
  RouterInput["questionBank"]["updateQuestion"];
