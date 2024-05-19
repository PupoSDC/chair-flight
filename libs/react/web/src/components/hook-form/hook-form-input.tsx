import { startTransition, useEffect, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { HookFormErrorMessage } from "./hook-form-error-message";
import type { FormControlProps, InputProps } from "@mui/joy";
import type { FunctionComponent } from "react";

type StyleProps = "sx" | "style" | "className";

export type HookFormInputProps = {
  name: string;
  formLabel?: string;
  optional?: boolean;
} & Pick<FormControlProps, StyleProps> &
  Omit<InputProps, StyleProps | "onChange" | "onBlur" | "value"> &
  Required<Pick<InputProps, "onChange" | "onBlur">>;

export const HookFormInput: FunctionComponent<HookFormInputProps> = ({
  sx,
  style,
  className,
  name,
  formLabel,
  onChange,
  optional,
  ...otherProps
}) => {
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
        error={!!error}
        name={name}
        value={localValue}
        onChange={handleChange}
        {...otherProps}
      />
      <HookFormErrorMessage name={name} />
    </FormControl>
  );
};
