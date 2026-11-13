import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const GithubIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M9 19c-4 1.500-4-2-6-2.500m12 5v-3.500c0-1 .100-1.400-.500-2 2.800-.300 5.500-1.400 5.500-6a4.600 4.600 0 0 0-1.300-3.200 4.200 4.200 0 0 0-.100-3.200s-1.100-.300-3.500 1.300a12 12 0 0 0-6.200 0C6.500 2.800 5.400 3.100 5.400 3.100a4.200 4.200 0 0 0-.100 3.200A4.600 4.600 0 0 0 4 9.500c0 4.600 2.700 5.700 5.500 6-.600.600-.600 1.200-.500 2V21" />
    </SvgIcon>
  );
};
