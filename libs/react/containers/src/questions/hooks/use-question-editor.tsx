import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { questionTemplateSchema } from "@chair-flight/core/question-bank";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

const editorSchema = z.object({
  deletedQuestions: z.record(questionTemplateSchema.or(z.null())).default({}),
  editedQuestions: z.record(questionTemplateSchema.or(z.null())).default({}),
  newQuestions: z.record(questionTemplateSchema.or(z.null())).default({}),
});

export type QuestionEditorState = z.infer<typeof editorSchema>;

const defaultValue = editorSchema.parse({});
const resolver = zodResolver(editorSchema);

const useQuestionEditorPersistence = {
  atpl: createUsePersistenceHook("cf-question-editor-atpl", defaultValue),
  type: createUsePersistenceHook("cf-question-editor-type", defaultValue),
  prep: createUsePersistenceHook("cf-question-editor-prep", defaultValue),
};

export const useQuestionEditor = ({
  questionBank,
}: {
  questionBank: QuestionBankName;
}) => {
  const { getData, setData } = useQuestionEditorPersistence[questionBank]();
  const form = useForm({ resolver, defaultValues: getData() });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setData(value as QuestionEditorState);
    });
    return () => subscription.unsubscribe();
  }, [form, setData]);

  return { form };
};
