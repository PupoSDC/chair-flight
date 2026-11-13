import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const AlarmIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3" />
    </SvgIcon>
  );
};
