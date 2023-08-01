import { forwardRef } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Select } from "@mui/joy";
import { HookFormErrorMessage } from "./hook-form-error-message";
import type { FormControlProps, SelectProps } from "@mui/joy";

type StyleProps = "sx" | "style" | "className";

export type HookFormSelectProps = {
  name: string;
  formLabel?: string;
  optional?: boolean;
} & Pick<FormControlProps, StyleProps> &
  Omit<SelectProps<object>, StyleProps | "onChange" | "onBlur" | "value"> &
  Required<Pick<SelectProps<object>, "onBlur">>;

export const HookFormSelect = forwardRef<
  HTMLButtonElement,
  HookFormSelectProps
>(({ sx, style, className, name, formLabel, optional, ...otherProps }, ref) => {
  const form = useFormContext();
  const error = get(form.formState.errors, name);
  const watchedValue = form.watch(name);
  const color = otherProps.color ?? (error ? "danger" : undefined);

  return (
    <FormControl sx={sx} style={style} className={className}>
      {formLabel && (
        <FormLabel
          sx={{ color: optional ? "text.tertiary" : "text.primary" }}
          children={formLabel}
        />
      )}
      <Select
        ref={ref}
        name={name}
        color={color}
        value={watchedValue}
        {...otherProps}
        onChange={(e, value) => {
          // note: its critical this onChange shadows the otherProps.
          form.setValue(name, value, {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
      />
      <HookFormErrorMessage name={name} />
    </FormControl>
  );
});

HookFormSelect.displayName = "HookFormSelect";
