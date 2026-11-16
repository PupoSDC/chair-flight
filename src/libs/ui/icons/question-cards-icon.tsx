import { SvgIcon } from "./svg-icon";
import type { FC } from "react";
import type { IconProps } from "./svg-icon";

export const QuestionCardsIcon: FC<IconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <rect x="7" y="3" width="14" height="15" rx="2" />
      <path d="M3 8v11a2 2 0 0 0 2 2h11" />
      <path d="M12 8a2 2 0 1 1 2.9 1.8c-.6.3-.9.8-.9 1.4M14 14.5h.01" />
    </SvgIcon>
  );
};
