import { forwardRef } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormHelperText, Input } from "@mui/joy";
import type { InputProps } from "@mui/joy";
import type { FieldValues, FieldErrors } from "react-hook-form";

export type HookFormInputProps = Omit<InputProps, "error" | "name"> & {
  name: string;
  errors: FieldErrors<FieldValues>;
};

export const HookFormInput = forwardRef<HTMLInputElement, HookFormInputProps>(
  (props, ref) => {
    const methods = useFormContext();
    const error = get(props.errors || methods.formState.errors, props.name);
    return (
      <>
        <Input ref={ref} {...props} error={!!error} />
        {error?.message && (
          <FormHelperText color="danger">{error.message}</FormHelperText>
        )}
      </>
    );
  },
);
