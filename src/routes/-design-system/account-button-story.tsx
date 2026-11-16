import { isUserFlowEnabled } from "../../libs/base/feature-flags";
import { AccountButton } from "../../libs/ui/components/community/account-button";
import { SidebarAccountItems } from "../../libs/ui/components/community/sidebar-account-items";
import { cn } from "../../libs/ui/utils/cn";
import { StoryBlock } from "./story-block";
import type { FC } from "react";

export const AccountButtonStory: FC = () => (
  <div className="flex max-w-2xl flex-col gap-6">
    <p className="m-0 text-sm text-muted">
      Live data: this talks to the real auth backend. The user flow flag is
      currently{" "}
      {isUserFlowEnabled ? "on" : "off, so AccountButton renders nothing"}.
    </p>
    <StoryBlock title='AccountButton variant="header"'>
      <div
        className={cn(
          "flex h-12 items-center justify-end rounded-lg border",
          "border-rule bg-paper px-4",
        )}
      >
        <AccountButton variant="header" />
      </div>
    </StoryBlock>
    <StoryBlock
      title="SidebarAccountItems"
      note="The account rows at the bottom of the app shell sidebar."
    >
      <div className="flex w-[210px] flex-col border border-rule bg-paper">
        <SidebarAccountItems showBackoffice={false} />
      </div>
    </StoryBlock>
  </div>
);
