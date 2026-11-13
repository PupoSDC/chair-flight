import type { FC, ReactNode } from "react";

export type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

type SvgIconProps = IconProps & {
  children: ReactNode;
  filled?: boolean;
  viewBox?: string;
};

export const SvgIcon: FC<SvgIconProps> = ({
  size = 16,
  className,
  filled,
  strokeWidth = 2,
  viewBox = "0 0 24 24",
  children,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
};
