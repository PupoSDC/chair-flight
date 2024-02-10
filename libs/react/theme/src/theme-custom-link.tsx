import { forwardRef } from "react";
import { default as NextLink } from "next/link";
import type { LinkProps } from "@mui/joy";

export const ThemeCustomLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & { href: string }
>((props, ref) => <NextLink ref={ref} {...props} />);

ThemeCustomLink.displayName = "ThemeCustomLink";
