import { Link } from "@tanstack/react-router";
import { createContext, useContext, useState } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { ChevronLeftIcon } from "../../icons/chevron-left-icon";
import { MenuIcon } from "../../icons/menu-icon";
import { cn } from "../../utils/cn";
import { ButtonIcon } from "./button-icon";
import { Wordmark } from "./wordmark";
import type { LinkProps } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";
import type { IconProps } from "../../icons/svg-icon";

const AppContext = createContext({
  isOpen: true,
  isMobile: false,
  isMobileOpen: false,
  toggle: () => {},
  closeMobile: () => {},
  openMobile: () => {},
});

const useApp = () => useContext(AppContext);

const SIDEBAR_ITEM_CLASS_NAME = cn(
  "flex flex-none cursor-pointer items-center gap-3 border-0 border-b",
  "border-l-4 border-rule bg-transparent p-2 text-sm font-medium",
  "whitespace-nowrap no-underline hover:text-accent",
);

const SIDEBAR_ITEM_INACTIVE_CLASS_NAME = "border-l-transparent text-ink";

const Root: FC<{
  contained?: boolean;
  children: ReactNode;
}> = ({ contained = false, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <AppContext
      value={{
        isOpen: isMobile ? isMobileOpen : isOpen,
        isMobile,
        isMobileOpen,
        toggle: () => (isMobile ? setIsMobileOpen(false) : setIsOpen(!isOpen)),
        openMobile: () => setIsMobileOpen(true),
        closeMobile: () => setIsMobileOpen(false),
      }}
    >
      <div
        className={cn(
          "grid grid-cols-[1fr] grid-rows-[3rem_minmax(0,1fr)] bg-canvas",
          "text-ink",
          "transition-[grid-template-columns] duration-250",
          isOpen ? "sm:grid-cols-[210px_1fr]" : "sm:grid-cols-[40px_1fr]",
          contained ? "h-full" : "h-dvh",
        )}
      >
        <div
          aria-hidden="true"
          onClick={() => setIsMobileOpen(false)}
          className={cn(
            "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden",
            !isMobileOpen && "hidden",
          )}
        />
        {children}
      </div>
    </AppContext>
  );
};

const AppSidebar: FC<{ children: ReactNode }> = ({ children }) => {
  const { isMobileOpen } = useApp();

  return (
    <nav
      className={cn(
        "z-40 flex flex-col overflow-x-hidden border-rule bg-paper",
        "row-span-2 max-sm:fixed max-sm:inset-y-0 max-sm:left-0 sm:border-r",
        "max-sm:transition-[width] max-sm:duration-250",
        isMobileOpen ? "w-[210px] border-r" : "max-sm:w-0",
      )}
    >
      {children}
    </nav>
  );
};

const AppLogo: FC = () => (
  <Wordmark className="h-12 flex-none border-b border-rule pl-2" />
);

const AppHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <header
    className={cn(
      "col-start-1 row-start-1 flex min-w-0 items-center gap-2",
      "border-b border-rule bg-paper px-4 sm:col-start-2",
    )}
  >
    {children}
  </header>
);

const AppMain: FC<{ children: ReactNode }> = ({ children }) => (
  <main
    className={cn(
      "col-start-1 row-start-2 min-h-0 min-w-0 overflow-auto",
      "overscroll-contain sm:col-start-2",
    )}
  >
    {children}
  </main>
);

const Fill: FC = () => {
  return <div className="flex-1" />;
};

const AppMenu: FC = () => {
  const { openMobile } = useApp();

  return (
    <ButtonIcon
      icon={MenuIcon}
      label="Open menu"
      className="sm:hidden"
      onClick={openMobile}
    />
  );
};

const SidebarItem: FC<{
  label: string;
  icon: FC<IconProps>;
  link: LinkProps;
  exact?: boolean;
}> = ({ label, icon: Icon, link, exact }) => {
  const { closeMobile } = useApp();

  return (
    <Link
      {...link}
      title={label}
      activeOptions={{ exact }}
      activeProps={{ className: "border-l-accent text-accent" }}
      inactiveProps={{ className: SIDEBAR_ITEM_INACTIVE_CLASS_NAME }}
      onClick={closeMobile}
      className={SIDEBAR_ITEM_CLASS_NAME}
    >
      <Icon size={20} className="flex-none" />
      <span>{label}</span>
    </Link>
  );
};

const SidebarButton: FC<{
  label: string;
  icon: FC<IconProps>;
  className?: string;
  onClick: () => void;
}> = ({ label, icon: Icon, className, onClick }) => (
  <button
    type="button"
    className={cn(
      SIDEBAR_ITEM_CLASS_NAME,
      SIDEBAR_ITEM_INACTIVE_CLASS_NAME,
      className,
    )}
    onClick={onClick}
  >
    <Icon size={20} className="flex-none" />
    <span>{label}</span>
  </button>
);

const SidebarCollapse: FC = () => {
  const { isOpen, toggle } = useApp();

  return (
    <button
      type="button"
      aria-label={isOpen ? "Collapse menu" : "Expand menu"}
      className={cn(
        SIDEBAR_ITEM_CLASS_NAME,
        SIDEBAR_ITEM_INACTIVE_CLASS_NAME,
        "border-t",
      )}
      onClick={toggle}
    >
      <ChevronLeftIcon
        size={20}
        className={cn(
          "flex-none sm:transition-transform sm:duration-250",
          !isOpen && "sm:rotate-180",
        )}
      />
      <span>Collapse</span>
    </button>
  );
};

export const App = Object.assign(Root, {
  Sidebar: AppSidebar,
  Logo: AppLogo,
  Header: AppHeader,
  Main: AppMain,
  Menu: AppMenu,
  Fill,
});

export const Sidebar = {
  Item: SidebarItem,
  Button: SidebarButton,
  Collapse: SidebarCollapse,
  Fill,
};
