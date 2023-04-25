import { forwardRef, useState } from "react";
import { Textarea } from "@mui/joy";
import type { TextareaProps } from "@mui/joy";

export const AutoExpandTextArea = forwardRef<
  HTMLDivElement,
  Omit<TextareaProps, "maxRows" | "minRows">
>((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Textarea
      {...props}
      ref={ref}
      maxRows={isFocused ? undefined : 1}
      minRows={isFocused ? 5 : 1}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
});

AutoExpandTextArea.displayName = "AutoExpandTextArea";
