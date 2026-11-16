import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const PlayIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props} filled>
      <path d="M7 4.6a1 1 0 0 1 1.5-.86l11 6.4a1.7 1.7 0 0 1 0 2.94l-11 6.4A1 1 0 0 1 7 19.4z" />
    </SvgIcon>
  );
};
