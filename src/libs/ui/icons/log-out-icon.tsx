import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const LogOutIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M9 4H5v16h4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M20 12H9" />
    </SvgIcon>
  );
};
