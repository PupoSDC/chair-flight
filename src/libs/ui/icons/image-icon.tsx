import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ImageIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <rect x="3.5" y="4.500" width="17" height="15" rx="2" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
      <path d="M15 9h.01" />
    </SvgIcon>
  );
};
