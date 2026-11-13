import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const LayersIcon: FC<IconProps & { stacked?: boolean }> = ({
  stacked,
  ...props
}) => {
  return (
    <SvgIcon {...props}>
      {stacked ? (
        <>
          <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
          <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
        </>
      ) : (
        <path d="m12 7 9 4.5-9 4.5-9-4.5z" />
      )}
    </SvgIcon>
  );
};
