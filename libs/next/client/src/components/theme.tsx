import { forwardRef } from "react";
import { default as NextLink } from "next/link";
import { extendTheme } from "@mui/joy";
import { theme as baseTheme } from "@chair-flight/react/components";
import type { LinkProps } from "@mui/joy";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  LinkProps & { href: string }
>((props, ref) => <NextLink ref={ref} {...props} />);

LinkBehavior.displayName = "LinkBehavior";

export const theme = extendTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    JoyLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
  },
});
