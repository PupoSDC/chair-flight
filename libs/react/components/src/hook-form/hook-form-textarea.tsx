import { forwardRef } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormHelperText, Textarea } from "@mui/joy";
import type { TextareaProps } from "@mui/joy";
import type { FieldValues, FieldErrors } from "react-hook-form";

export type HookFormTextAreaProps = Omit<TextareaProps, "error" | "name"> & {
  name: string;
  errors: FieldErrors<FieldValues>;
};

export const HookFormTextArea = forwardRef<
  HTMLInputElement,
  HookFormTextAreaProps
>((props, ref) => {
  const methods = useFormContext();
  const error = get(props.errors || methods.formState.errors, props.name);
  return (
    <>
      <Textarea ref={ref} {...props} error={!!error} />
      {error?.message && (
        <FormHelperText color="danger">{error.message}</FormHelperText>
      )}
    </>
  );
});
