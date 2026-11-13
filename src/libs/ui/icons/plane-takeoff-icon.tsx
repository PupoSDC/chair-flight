import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const PlaneTakeoffIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon filled {...props}>
      <path d="M3 20h18v1.8H3z" />
      <g transform="translate(12 10.5) rotate(-25) scale(0.85) translate(-12 -12)">
        <path d="M3 12.5C3 11 4 10.5 5 10.5h12.5c2.5 0 4 1 4 2s-1.500 2-4 2H5c-1 0-2-.5-2-2z" />
        <path d="M3.500 10.500 2.500 5.500H5l2.500 5z" />
        <path d="M10 13.500 8.500 19H11l4.500-5.500z" />
      </g>
    </SvgIcon>
  );
};
