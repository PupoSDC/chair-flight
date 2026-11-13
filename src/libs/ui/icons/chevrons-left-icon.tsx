import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ChevronsLeftIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
    </SvgIcon>
  );
};
