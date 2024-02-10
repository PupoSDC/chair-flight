import { useEffect, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as CreateIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { questionVariantOneTwoSchema } from "@chair-flight/core/question-bank";
import { HookFormTextArea } from "@chair-flight/react/components";
import { HookFormErrorMessage } from "@chair-flight/react/components";
import type { QuestionVariantOneTwo } from "@chair-flight/core/question-bank";
import type { FunctionComponent } from "react";

const resolver = zodResolver(questionVariantOneTwoSchema);

type Statements =
  | "firstCorrectStatements"
  | "firstIncorrectStatements"
  | "secondCorrectStatements"
  | "secondIncorrectStatements";

const statementTypes: Statements[] = [
  "firstCorrectStatements",
  "firstIncorrectStatements",
  "secondCorrectStatements",
  "secondIncorrectStatements",
];

export const QuestionEditorVariantOneTwo: FunctionComponent<{
  variant: QuestionVariantOneTwo;
  setVariant: (variant: QuestionVariantOneTwo) => void;
}> = ({ variant: defaultValues, setVariant }) => {
  const [, startTransition] = useTransition();
  const form = useForm({ defaultValues, resolver, mode: `onChange` });

  useEffect(() => {
    const subscription = form.watch((value) => {
      startTransition(() => setVariant(value as QuestionVariantOneTwo));
    });
    return () => subscription.unsubscribe();
  }, [form, setVariant]);

  return (
    <FormProvider {...form}>
      <HookFormTextArea {...form.register(`question`)} minRows={6} />
      <Divider />
      <Stack gap={1}>
        <HookFormErrorMessage name={"options"} />
        {statementTypes.map((statementType) => {
          const statements = form.watch(statementType);
          const statementText = statementType
            .split(/(?=[A-Z])/)
            .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
            .join(" ");
          return (
            <>
              <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography level="h5">{statementText}</Typography>
                <IconButton
                  variant="plain"
                  color="success"
                  size="sm"
                  children={<CreateIcon />}
                  onClick={() => {
                    const length = statements.length;
                    form.setValue(`${statementType}.${length}`, "New Option");
                    form.trigger(`${statementType}`);
                  }}
                />
              </Stack>
              {statements.map((_, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems={"center"}
                  gap={1}
                >
                  <HookFormTextArea
                    {...form.register(`${statementType}.${index}`)}
                    sx={{ flex: 1 }}
                    minRows={1}
                  />
                  <IconButton
                    variant="plain"
                    color="danger"
                    size="sm"
                    disabled={statements.length <= 1}
                    children={<CloseIcon />}
                    onClick={() =>
                      form.setValue(
                        `${statementType}`,
                        statements.filter((_, i) => i !== index),
                      )
                    }
                  />
                </Stack>
              ))}
            </>
          );
        })}
      </Stack>
    </FormProvider>
  );
};
