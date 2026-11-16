import { App, Sidebar } from "../../libs/ui/components/base/app-shell";
import { Breadcrumbs } from "../../libs/ui/components/base/breadcrumbs";
import { useTheme } from "../../libs/ui/hooks/use-theme";
import { BookIcon } from "../../libs/ui/icons/book-icon";
import { HelpIcon } from "../../libs/ui/icons/help-icon";
import { HomeIcon } from "../../libs/ui/icons/home-icon";
import { ListIcon } from "../../libs/ui/icons/list-icon";
import { MoonIcon } from "../../libs/ui/icons/moon-icon";
import { SunIcon } from "../../libs/ui/icons/sun-icon";
import { cn } from "../../libs/ui/utils/cn";
import { STORY_LINK } from "./story-block";
import type { FC } from "react";

export const AppShellStory: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={cn(
        "h-[520px] overflow-hidden rounded-lg border border-rule",
        "[transform:translateZ(0)]",
      )}
    >
      <App contained>
        <App.Sidebar>
          <App.Logo />
          <Sidebar.Item icon={HomeIcon} label="Home" link={{ to: "/" }} exact />
          <Sidebar.Item icon={HelpIcon} label="Questions" link={STORY_LINK} />
          <Sidebar.Item
            icon={ListIcon}
            label="Tests"
            link={{ to: "/modules" }}
          />
          <Sidebar.Item
            icon={BookIcon}
            label="Docs"
            link={{ to: "/modules" }}
          />
          <Sidebar.Fill />
          <Sidebar.Button
            icon={theme === "light" ? SunIcon : MoonIcon}
            label={theme === "light" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          />
          <Sidebar.Collapse />
        </App.Sidebar>
        <App.Header>
          <Breadcrumbs
            items={[
              { label: "ATPL", link: STORY_LINK },
              { label: "Questions", link: STORY_LINK },
              { label: "QDS1" },
            ]}
          />
          <App.Fill />
          <App.Menu />
        </App.Header>
        <App.Main>
          <p className="m-0 p-6 text-center text-sm text-muted">
            Page content scrolls here. Collapse the sidebar with the button at
            the bottom; on a phone it becomes an overlay opened from the header.
          </p>
        </App.Main>
      </App>
    </div>
  );
};
