import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ConstructionIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M14 7l3-3 3 3-3 3z" />
      <path d="M15.5 8.5L5 19l-1-1L14.5 7.5" />
      <path d="M3 21l3-3" />
      <path d="M9 5l2 2M6 8l2 2" />
    </SvgIcon>
  );
};
