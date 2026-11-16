import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ShieldIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M12 3 5 6v5c0 4.500 3 8 7 10 4-2 7-5.500 7-10V6Z" />
    </SvgIcon>
  );
};
