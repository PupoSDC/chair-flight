import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";
import type { IconProps } from "../../icons/svg-icon";

export const ButtonIcon: FC<
  Omit<ComponentProps<"button">, "children" | "aria-label"> & {
    icon: FC<IconProps>;
    label: string;
  }
> = ({ icon: Icon, label, type = "button", className, ...props }) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={cn(
      "inline-flex size-8 flex-none cursor-pointer items-center",
      "justify-center rounded-md border-0 bg-transparent text-ink",
      "enabled:hover:text-accent",
      "disabled:cursor-default disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <Icon size={16} />
  </button>
);
