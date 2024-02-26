"use client";

import { forwardRef, startTransition, useEffect, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { HookFormErrorMessage } from "./hook-form-error-message";
import type { FormControlProps, InputProps } from "@mui/joy";

type StyleProps = "sx" | "style" | "className";

export type HookFormInputProps = {
  name: string;
  formLabel?: string;
  optional?: boolean;
} & Pick<FormControlProps, StyleProps> &
  Omit<InputProps, StyleProps | "onChange" | "onBlur" | "value"> &
  Required<Pick<InputProps, "onChange" | "onBlur">>;

export const HookFormInput = forwardRef<HTMLInputElement, HookFormInputProps>(
  (
    {
      sx,
      style,
      className,
      name,
      formLabel,
      onChange,
      optional,
      ...otherProps
    },
    ref,
  ) => {
    const form = useFormContext();
    const error = get(form.formState.errors, name);
    const watchedValue = form.watch(name);
    const [localValue, setLocalValue] = useState(watchedValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(event.target.value);
      startTransition(() => onChange?.(event));
    };

    useEffect(() => setLocalValue(watchedValue), [watchedValue]);

    return (
      <FormControl sx={sx} style={style} className={className}>
        {formLabel && (
          <FormLabel
            sx={{ color: optional ? "text.tertiary" : "text.primary" }}
            children={formLabel}
          />
        )}
        <Input
          ref={ref}
          error={!!error}
          name={name}
          value={localValue}
          onChange={handleChange}
          {...otherProps}
        />
        <HookFormErrorMessage name={name} />
      </FormControl>
    );
  },
);

HookFormInput.displayName = "HookFormInput";
