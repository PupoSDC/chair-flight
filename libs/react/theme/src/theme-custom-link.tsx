import { default as NextLink } from "next/link";
import type { LinkProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export const ThemeCustomLink: FunctionComponent<
  LinkProps & { href: string }
> = (props) => <NextLink {...props} />;
