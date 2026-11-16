import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const LightbulbIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.500 10.900c.600.500 1 1.200 1 2.100h5c0-.900.400-1.600 1-2.100A6 6 0 0 0 12 3Z" />
    </SvgIcon>
  );
};
