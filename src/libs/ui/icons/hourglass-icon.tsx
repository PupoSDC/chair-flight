import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const HourglassIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 5 3 6 5 9-2 3-5 4-5 9M17 3c0 5-3 6-5 9 2 3 5 4 5 9" />
    </SvgIcon>
  );
};
