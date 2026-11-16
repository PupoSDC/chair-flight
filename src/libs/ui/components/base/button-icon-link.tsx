import { createLink } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { ComponentProps, FC } from "react";
import type { IconProps } from "../../icons/svg-icon";

const ButtonIconAnchor: FC<
  Omit<ComponentProps<"a">, "children" | "aria-label"> & {
    icon: FC<IconProps>;
    label: string;
  }
> = ({ icon: Icon, label, className, ...props }) => (
  <a
    title={label}
    className={cn(
      "inline-flex size-8 flex-none cursor-pointer items-center",
      "justify-center rounded-md text-ink no-underline hover:text-accent",
      className,
    )}
    {...props}
  >
    <Icon size={16} />
    <span className="sr-only">{label}</span>
  </a>
);

export const ButtonIconLink = createLink(ButtonIconAnchor);
