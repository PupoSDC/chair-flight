import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const MessageIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M4 5.500A1.500 1.500 0 0 1 5.500 4h13A1.500 1.500 0 0 1 20 5.500v9a1.500 1.500 0 0 1-1.500 1.500H10l-4.500 4v-4h0A1.500 1.500 0 0 1 4 14.500Z" />
    </SvgIcon>
  );
};
