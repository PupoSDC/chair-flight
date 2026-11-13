import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const HomeIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
    </SvgIcon>
  );
};
