import { forwardRef } from 'react';

// react props for a link elemet

const TemporaryLinkComponent = forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>((props, ref) => <a {...props} ref={ref} />);

export const useLinkComponent = () => {
  return { Link: TemporaryLinkComponent };
};
