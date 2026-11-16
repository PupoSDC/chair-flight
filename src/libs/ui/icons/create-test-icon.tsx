import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const CreateTestIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M15 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3" />
      <path d="m7.5 11 1.5 1.5 4-4M7.5 16h4M18 12v8m-4-4h8" />
    </SvgIcon>
  );
};
