import { extendTheme, LinkProps } from '@mui/joy';
import NextLink from 'next/link';
import { forwardRef } from 'react';

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  LinkProps & { href: string }
>((props, ref) => <NextLink ref={ref} {...props} />);

LinkBehavior.displayName = 'LinkBehavior';

export const theme = extendTheme({
  components: {
    JoyLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
  },
});
