import { HookFormErrorMessage, HookFormTextArea } from "@chair-flight/react/components";
import { Box, FormLabel, IconButton, Sheet, Stack, Switch } from "@mui/joy";
import { FunctionComponent } from "react";
import { QuestionEditorState } from "../hooks/use-question-editor";
import { Controller, get, useFormContext } from "react-hook-form";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { QuestionBankName, QuestionVariantSimple } from "@chair-flight/core/question-bank";
import { getRandomId } from "@chair-flight/base/utils";
import { ZodError } from "zod";

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
        const variant = form.watch(`${variantKey}`) as QuestionVariantSimple;

        const createOption = () => {
            const id = getRandomId();
            form.setValue(`${variantKey}.options.${variant.options.length}`, {
                id: id,
                text: "",
                correct: false,
                why: "",
            });
        };

        const deleteOption = (id: string) => {
            form.setValue(
                `${variantKey}.options`,
                variant.options.filter((opt) => id !== opt.id),
            );
        };

        const optionsError = get(
            form.formState.errors,
            `${variantKey}.options`,
          ) as ZodError;

        return (
            <Stack>
                <HookFormTextArea
                    {...form.register(`${variantKey}.question`)}
                    formLabel={"Question"}
                    minRows={1}
                />
                <FormLabel sx={{ mt: 1 }}>
                    Options
                    <IconButton
                        sx={{ ml: "auto" }}
                        variant="plain"
                        color="success"
                        onClick={createOption}
                        children={<AddIcon />}
                    />
                </FormLabel>
                {variant.options.map((option, index) => {
                    const optionPath = `${variantKey}.options.${index}` as const;

                    return (
                        <Sheet
                            key={option.id}
                            sx={{ p: 1, my: 1 }}
                            variant="outlined"
                            color={optionsError ? "danger" : "neutral"}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Controller
                                    name={`${optionPath}.correct`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={field.value}
                                            sx={{ width: "100%" }}
                                            color={field.value ? "success" : "danger"}
                                            endDecorator={field.value ? "Correct" : "Wrong"}
                                        />
                                    )}
                                />
                                <Box sx={{ flex: 1 }} />
                                <IconButton
                                    variant="plain"
                                    color="danger"
                                    onClick={() => deleteOption(option.id)}
                                    children={<CloseIcon />}
                                />
                            </Box>
                            <HookFormTextArea
                                {...form.register(`${optionPath}.text`)}
                                placeholder="Write an option here"
                                minRows={1}
                                sx={{ mt: 1 }}
                            />
                            <HookFormTextArea
                                {...form.register(`${optionPath}.why`)}
                                placeholder="Use this to briefly justify this option"
                                formLabel="Why"
                                minRows={1}
                                sx={{ mt: 1 }}
                            />
                            <HookFormErrorMessage name={`${optionPath}`} />
                        </Sheet>
                    );
                })}
            </Stack>
        )
    }