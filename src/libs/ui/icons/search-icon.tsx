import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const SearchIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <circle cx="11" cy="11" r="6.500" />
      <path d="m20 20-4.400-4.400" />
    </SvgIcon>
  );
};
