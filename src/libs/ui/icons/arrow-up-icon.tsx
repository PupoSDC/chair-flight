import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ArrowUpIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </SvgIcon>
  );
};
