import {
  createFileRoute,
  notFound,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { isUserFlowEnabled } from "../../libs/base/feature-flags";
import { App, Sidebar } from "../../libs/ui/components/base/app-shell";
import { Breadcrumbs } from "../../libs/ui/components/base/breadcrumbs";
import { SidebarAccountItems } from "../../libs/ui/components/community/sidebar-account-items";
import { useAuth } from "../../libs/ui/hooks/use-auth";
import { useTheme } from "../../libs/ui/hooks/use-theme";
import { MessageIcon } from "../../libs/ui/icons/message-icon";
import { MoonIcon } from "../../libs/ui/icons/moon-icon";
import { SunIcon } from "../../libs/ui/icons/sun-icon";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";
import type { Breadcrumb } from "../../libs/ui/components/base/breadcrumbs";

const NAV_ITEMS = [
  { to: "/backoffice/comments", label: "Review comments", icon: MessageIcon },
] as const;

const BackofficeLayout: FC = () => {
  const { status, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((item) => pathname.startsWith(item.to));
  const breadcrumbs: Breadcrumb[] = [
    { label: "Back office" },
    ...(current ? [{ label: current.label }] : []),
  ];

  return (
    <App>
      <App.Sidebar>
        <App.Logo />
        {NAV_ITEMS.map((item) => (
          <Sidebar.Item
            key={item.to}
            icon={item.icon}
            label={item.label}
            link={{ to: item.to }}
          />
        ))}
        <Sidebar.Fill />
        <Sidebar.Button
          icon={theme === "light" ? SunIcon : MoonIcon}
          label={theme === "light" ? "Light mode" : "Dark mode"}
          onClick={toggleTheme}
        />
        <SidebarAccountItems showBackoffice={false} />
      </App.Sidebar>
      <App.Header>
        <Breadcrumbs items={breadcrumbs} />
        <App.Menu />
      </App.Header>
      <App.Main>
        <div
          className={cn(
            "mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8",
          )}
        >
          {user?.role === "admin" ? (
            <Outlet />
          ) : (
            <p className="m-0 p-10 text-center text-muted">
              {status === "loading"
                ? "Loading…"
                : "The back office is only available to administrators."}
            </p>
          )}
        </div>
      </App.Main>
    </App>
  );
};

export const Route = createFileRoute("/(backoffice)/backoffice")({
  beforeLoad: () => {
    if (!isUserFlowEnabled) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Back Office · Chair Flight" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BackofficeLayout,
});
