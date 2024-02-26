"use client";

import { forwardRef, useCallback, useState } from "react";
import { Button } from "@mui/joy";
import type { ButtonProps } from "@mui/joy";

export const LoadingButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "loading">
>(({ onClick, ...props }, ref) => {
  const [loading, setLoading] = useState(false);

  const newOnClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      try {
        await onClick?.(event);
      } finally {
        setLoading(false);
      }
    },
    [onClick],
  );

  return <Button ref={ref} {...props} loading={loading} onClick={newOnClick} />;
});

LoadingButton.displayName = "LoadingButton";
