import { cn } from "../../utils/cn";
import type { FC, ReactNode } from "react";

export const Card: FC<{
  as?: "div" | "li" | "section" | "article";
  className?: string;
  children: ReactNode;
}> = ({ as: Tag = "div", className, children }) => (
  <Tag className={cn("rounded-lg border border-rule bg-paper p-3", className)}>
    {children}
  </Tag>
);
