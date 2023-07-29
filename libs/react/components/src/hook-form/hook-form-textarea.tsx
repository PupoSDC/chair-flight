import { forwardRef, startTransition, useEffect, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { HookFormErrorMessage } from "./hook-form-error-message";
import type { TextareaProps } from "@mui/joy";

export type HookFormTextAreaProps = Pick<
  TextareaProps,
  "sx" | "style" | "className"
> &
  Omit<TextareaProps, "sx" | "style" | "className"> & {
    name: string;
    formLabel?: string;
  };

export const HookFormTextArea = forwardRef<
  HTMLInputElement,
  HookFormTextAreaProps
>(
  (
    { sx, style, className, name, formLabel, onChange, value, ...otherProps },
    ref,
  ) => {
    const form = useFormContext();
    const error = get(form.formState.errors, name);
    const [localValue, setLocalValue] = useState(value);
    const watchedValue = form.watch(name);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalValue(event.target.value);
      startTransition(() => onChange?.(event));
    };

    useEffect(() => setLocalValue(value), [value]);
    useEffect(() => setLocalValue(watchedValue), [watchedValue]);

    return (
      <FormControl sx={sx} style={style} className={className}>
        {formLabel && <FormLabel>{formLabel}</FormLabel>}
        <Textarea
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
