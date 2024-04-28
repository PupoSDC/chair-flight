import { get, useFormContext } from "react-hook-form";
import { Typography } from "@mui/joy";
import type { TypographyProps } from "@mui/joy";
import type { FunctionComponent } from "react";
import type { ZodError } from "zod";

export type HookFormErrorMessageProps = Omit<
  TypographyProps,
  "children" | "name"
> & {
  name: string;
};

export const HookFormErrorMessage: FunctionComponent<
  HookFormErrorMessageProps
> = ({ name, ...props }) => {
  const form = useFormContext();
  const error = get(form.formState.errors, name) as ZodError;

  if (!error) return null;

  return (
    <Typography
      level="body-sm"
      color="danger"
      {...props}
      sx={{ mt: 0.5, ml: 2, ...props.sx }}
    >
      {error.message}
    </Typography>
  );
};
