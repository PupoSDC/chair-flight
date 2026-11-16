import { Logo } from "../../libs/ui/components/base/logo";
import type { FC } from "react";

export const LogoStory: FC = () => (
  <div className="flex items-center gap-6">
    <Logo />
    <Logo className="size-12" />
  </div>
);
