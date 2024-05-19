import { useCallback, useState } from "react";
import { Button } from "@mui/joy";
import type { ButtonProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export const LoadingButton: FunctionComponent<Omit<ButtonProps, "loading">> = ({
  onClick,
  ...props
}) => {
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

  return <Button {...props} loading={loading} onClick={newOnClick} />;
};
