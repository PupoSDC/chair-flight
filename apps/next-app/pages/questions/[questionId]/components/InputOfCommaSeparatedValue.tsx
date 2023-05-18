import { forwardRef, useEffect, useState } from "react";
import { Chip, ChipDelete, Textarea, textareaClasses } from "@mui/joy";
import type { TextareaProps } from "@mui/joy";

export const InputOfCommaSeparatedValue = forwardRef<
  HTMLDivElement,
  Omit<
    TextareaProps,
    "value" | "onKeyPress" | "startDecorator" | "onKeyPress"
  > & {
    value?: string[];
    onChange?: (value: string[]) => void;
  }
>(({ value = [], onChange, ...props }, ref) => {
  const [newValue, setNewValue] = useState<string>("");

  const updateValue = (newValue: string) => {
    if (newValue.match(/[, \t\n]/) && newValue.trim().length) {
      setNewValue("");
      onChange?.([...new Set([...value, newValue.trim()])]);
    }
  };

  useEffect(() => updateValue(newValue));

  return (
    <Textarea
      ref={ref}
      sx={{
        [`& .${textareaClasses.startDecorator}`]: {
          flexWrap: "wrap",
        },
      }}
      startDecorator={
        value.length
          ? value.map((v) => (
              <Chip
                key={v}
                sx={{ m: 0.5 }}
                color="primary"
                variant="outlined"
                children={v}
                endDecorator={
                  <ChipDelete
                    color="primary"
                    onDelete={() => {
                      onChange?.(value.filter((x) => x !== v));
                    }}
                  />
                }
              />
            ))
          : undefined
      }
      value={newValue}
      minRows={1}
      onChange={(e) => {
        setNewValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !newValue.length) {
          onChange?.(value.slice(0, -1));
        }
      }}
      {...props}
    />
  );
});

InputOfCommaSeparatedValue.displayName = "InputOfCommaSeparatedValue";
