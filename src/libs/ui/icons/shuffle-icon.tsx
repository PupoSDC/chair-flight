import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ShuffleIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M4 7h3.500c5 0 4 10 9 10H20" />
      <path d="M4 17h3.500c1.400 0 2.300-.800 3-1.900M13 8.900c.700-1.100 1.600-1.900 3.500-1.900H20" />
      <path d="m17.500 4.500 2.500 2.500-2.500 2.500M17.500 14.500 20 17l-2.500 2.500" />
    </SvgIcon>
  );
};
