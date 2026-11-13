import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ChevronLeftIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M15 6l-6 6 6 6" />
    </SvgIcon>
  );
};
