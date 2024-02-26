"use client";

import { forwardRef } from "react";
import { get, useFormContext } from "react-hook-form";
import { Typography } from "@mui/joy";
import type { TypographyProps } from "@mui/joy";
import type { ZodError } from "zod";

export type HookFormErrorMessageProps = Omit<
  TypographyProps,
  "children" | "name"
> & {
  name: string;
};

export const HookFormErrorMessage = forwardRef<
  HTMLParagraphElement,
  HookFormErrorMessageProps
>(({ name, ...props }, ref) => {
  const form = useFormContext();
  const error = get(form.formState.errors, name) as ZodError;

  if (!error) return null;

  return (
    <Typography
      ref={ref}
      level="body-sm"
      color="danger"
      {...props}
      sx={{ mt: 0.5, ml: 2, ...props.sx }}
    >
      {error.message}
    </Typography>
  );
});

HookFormErrorMessage.displayName = "HookFormErrorMessage";
