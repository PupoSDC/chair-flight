import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { Button, Stack } from "@mui/joy";
import { editQuestionsPrMetaSchema } from "@cf/core/github";
import { HookFormInput, HookFormTextArea } from "@cf/react/components";
import { trpc, type AppRouterOutput } from "@cf/trpc/client";
import { container } from "@cf/trpc/client";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import type { QuestionBankName } from "@cf/core/question-bank";

type Props = {
  component?: "form";
  questionBank: QuestionBankName;
};

type Params = Record<string, never>;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorSubmitForm"];

const resolver = zodResolver(editQuestionsPrMetaSchema);

export const QuestionEditorSubmitForm = container<Props, Params, Data>(
  ({ sx, questionBank }) => {
    const createPr = trpc.common.github.createEditQuestionsPr.useMutation();

    const { questions, deletedQuestions } = useQuestionEditor((s) => ({
      questions: Object.values(s[questionBank].afterState).filter(Boolean),
      deletedQuestions: Object.entries(s[questionBank].afterState)
        .filter(([, v]) => !v)
        .map(([k]) => s[questionBank].beforeState[k]),
    }));

    const form = useForm({
      resolver,
      defaultValues: {
        title: "",
        description: "",
        authorName: "",
        email: "",
      },
    });

    const onSubmit = form.handleSubmit(async (data) => {
      await createPr.mutateAsync({
        questionBank,
        questions,
        deletedQuestions,
        meta: data,
      });
    });

    return (
      <Stack
        direction="column"
        component={"form"}
        gap={2}
        sx={sx}
        onSubmit={onSubmit}
      >
        <FormProvider {...form}>
          <HookFormInput
            {...form.register("title")}
            formLabel="Title"
            placeholder="Title"
          />
          <HookFormTextArea
            {...form.register("description")}
            formLabel="Description"
            placeholder="Description"
            minRows={5}
            maxRows={5}
          />
          <HookFormInput
            {...form.register("authorName")}
            optional
            formLabel="Author's name / ID (Optional)"
            placeholder="Author's name"
          />
          <HookFormInput
            {...form.register("email")}
            optional
            formLabel="Email (Optional)"
            placeholder="Email"
          />
          <Button
            loading={createPr.isLoading}
            fullWidth
            size="lg"
            color="success"
            disabled={!form.formState.isValid}
            type="submit"
            endDecorator={<GithubIcon />}
            children={"Create a Pull Request!"}
          />
        </FormProvider>
      </Stack>
    );
  },
);

QuestionEditorSubmitForm.displayName = "QuestionEditorSubmitForm";

QuestionEditorSubmitForm.getData = async () => ({});
QuestionEditorSubmitForm.useData = () => ({});
