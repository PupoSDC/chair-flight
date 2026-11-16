import { ButtonIcon } from "../../libs/ui/components/base/button-icon";
import { CloseIcon } from "../../libs/ui/icons/close-icon";
import { MenuIcon } from "../../libs/ui/icons/menu-icon";
import { ShuffleIcon } from "../../libs/ui/icons/shuffle-icon";
import type { FC } from "react";

export const ButtonIconStory: FC = () => (
  <div className="flex items-center gap-3">
    <ButtonIcon icon={MenuIcon} label="Menu" />
    <ButtonIcon icon={ShuffleIcon} label="Shuffle" />
    <ButtonIcon icon={CloseIcon} label="Disabled" disabled />
  </div>
);
