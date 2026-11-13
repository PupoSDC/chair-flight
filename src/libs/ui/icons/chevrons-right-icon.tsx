import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ChevronsRightIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />
    </SvgIcon>
  );
};
