import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const MenuIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </SvgIcon>
  );
};
