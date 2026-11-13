import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";

export const Checkbox: FC<
  Omit<ComponentProps<"input">, "type"> & { indeterminate?: boolean }
> = ({ indeterminate = false, className, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn("size-4 flex-none cursor-pointer accent-accent", className)}
      {...props}
    />
  );
};
