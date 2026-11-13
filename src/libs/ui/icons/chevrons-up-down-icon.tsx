import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ChevronsUpDownIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
    </SvgIcon>
  );
};
