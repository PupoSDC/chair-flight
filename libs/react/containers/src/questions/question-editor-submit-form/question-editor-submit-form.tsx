import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { Button, Stack } from "@mui/joy";
import { z } from "zod";
import {
  HookFormInput,
  HookFormTextArea,
} from "@chair-flight/react/components";
import { type AppRouterOutput } from "@chair-flight/trpc/client";
import { container } from "../../wraper/container";

type Props = {
  component?: "form";
};

type Params = Record<string, never>;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorSubmitForm"];

const formSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  authorName: z.string().optional(),
  email: z.string().optional(),
});

const resolver = zodResolver(formSchema);

export const QuestionEditorSubmitForm = container<Props, Params, Data>(
  ({ sx }) => {
    const form = useForm({
      resolver,
      defaultValues: formSchema.parse({}),
    });

    const onSubmit = form.handleSubmit(async (data) => {
      console.log(data);
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
