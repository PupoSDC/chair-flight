import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const ArrowDownIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </SvgIcon>
  );
};
