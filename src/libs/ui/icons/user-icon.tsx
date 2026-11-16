import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const UserIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </SvgIcon>
  );
};
