import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const StudentNotesIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <rect x="5.5" y="3.5" width="14" height="17" rx="2" />
      <path d="M3.5 8h4m-4 4h4m-4 4h4M11 8h5m-5 4h5m-5 4h3" />
    </SvgIcon>
  );
};
