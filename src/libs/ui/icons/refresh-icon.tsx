import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const RefreshIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M20 12a8 8 0 1 1-2.340-5.660L20 8.500" />
      <path d="M20 4v4.500h-4.500" />
    </SvgIcon>
  );
};
