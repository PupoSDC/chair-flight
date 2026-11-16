import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const HangarIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M2.5 20V9L12 4l9.5 5v11H2.5Z" />
      <path d="M6.5 20V11.5h11V20M6.5 15.5h11" />
    </SvgIcon>
  );
};
