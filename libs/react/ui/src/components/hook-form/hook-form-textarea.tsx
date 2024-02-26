import { forwardRef, startTransition, useEffect, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { HookFormErrorMessage } from "./hook-form-error-message";
import type { FormControlProps, TextareaProps } from "@mui/joy";

type StyleProps = "sx" | "style" | "className";

export type HookFormTextAreaProps = {
  name: string;
  formLabel?: string;
} & Pick<FormControlProps, StyleProps> &
  Omit<TextareaProps, StyleProps | "onChange" | "onBlur" | "value"> &
  Required<Pick<TextareaProps, "onChange" | "onBlur">>;

export const HookFormTextArea = forwardRef<
  HTMLInputElement,
  HookFormTextAreaProps
>(({ sx, style, className, name, formLabel, onChange, ...otherProps }, ref) => {
  const form = useFormContext();
  const error = get(form.formState.errors, name);
  const watchedValue = form.watch(name);
  const [localValue, setLocalValue] = useState(watchedValue);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(event.target.value);
    startTransition(() => onChange?.(event));
  };

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
});

HookFormTextArea.displayName = "HookFormTextArea";
