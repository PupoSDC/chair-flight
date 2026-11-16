import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { cn } from "../../utils/cn";
import type { LinkProps } from "@tanstack/react-router";
import type { FC } from "react";

export type Breadcrumb = {
  label: string;
  link?: LinkProps;
};

export const Breadcrumbs: FC<{ items: Breadcrumb[] }> = ({ items }) => (
  <nav
    aria-label="Breadcrumb"
    className="flex min-w-0 flex-1 items-center gap-1 text-sm"
  >
    {items.map((item, index) => {
      const isFirst = index === 0;
      const isLast = index === items.length - 1 && !isFirst;
      const className = cn(
        isFirst && "flex-none font-semibold text-ink",
        !isFirst && !isLast && "min-w-0 truncate text-ink",
        isLast && "min-w-0 truncate text-muted",
      );
      return (
        <Fragment key={item.label}>
          {!isFirst && (
            <ChevronRightIcon size={14} className="flex-none text-muted" />
          )}
          {item.link ? (
            <Link
              {...item.link}
              className={cn(
                className,
                "no-underline",
                !isFirst && "hover:text-accent",
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={className}
              aria-current={isLast ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </Fragment>
      );
    })}
  </nav>
);
