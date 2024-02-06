import { HookFormTextArea } from "@chair-flight/react/components";
import { Stack, Switch } from "@mui/joy";
import { FunctionComponent } from "react";
import { QuestionEditorState } from "../hooks/use-question-editor";
import { Controller, useFormContext } from "react-hook-form";

export type QuestionEditorVariantSimpleProps = {
    questionId: string;
};

export const QuestionEditorVariantSimple: FunctionComponent<
    QuestionEditorVariantSimpleProps
> = ({
    questionId
}) => {
        const variantKey = `editedQuestions.${questionId}.variant` as const;
        const form = useFormContext<QuestionEditorState>();

        return (
            <Stack>
                <HookFormTextArea
                    {...form.register(`${variantKey}.question`)}
                    formLabel={"Question"}
                    minRows={1}
                />
                <Controller
                    name={`${variantKey}.answer`}
                    control={form.control}
                    render={({ field }) => (
                        <Switch
                            {...field}
                            checked={field.value}
                            sx={{ width: "100%" }}
                            color={field.value ? "success" : "danger"}
                            endDecorator={field.value ? "True" : "False"}
                        />
                    )}
                />
            </Stack>
        )
    }