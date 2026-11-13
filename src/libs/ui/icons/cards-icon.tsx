import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const CardsIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <rect x="7" y="3.500" width="13" height="13" rx="2" />
      <path d="M4 8v10a2.500 2.500 0 0 0 2.500 2.500H16" />
    </SvgIcon>
  );
};
