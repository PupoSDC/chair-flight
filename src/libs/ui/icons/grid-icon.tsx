import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const GridIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <circle cx="5" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="19" cy="5" r="1.6" fill="currentColor" />
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
      <circle cx="5" cy="19" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
      <circle cx="19" cy="19" r="1.6" fill="currentColor" />
    </SvgIcon>
  );
};
