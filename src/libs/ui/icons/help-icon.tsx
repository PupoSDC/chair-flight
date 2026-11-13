import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const HelpIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.400-1 .900-1 1.700" />
      <path d="M12 16.500h.01" />
    </SvgIcon>
  );
};
