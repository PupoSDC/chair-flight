import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { isUserFlowEnabled } from "../../../base/feature-flags";
import { useAuth } from "../../hooks/use-auth";
import { LogOutIcon } from "../../icons/log-out-icon";
import { ShieldIcon } from "../../icons/shield-icon";
import { UserIcon } from "../../icons/user-icon";
import { cn } from "../../utils/cn";
import { ButtonIcon } from "../base/button-icon";
import { AccountModal } from "./account-modal";
import { SidebarAccountItems } from "./sidebar-account-items";
import type { FC } from "react";

const HeaderAccountMenu: FC = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <ButtonIcon
        label={user ? "Account menu" : "Sign in"}
        aria-haspopup={user ? "menu" : "dialog"}
        aria-expanded={user ? open : undefined}
        onClick={() => (user ? setOpen(!open) : setSigningIn(true))}
        icon={UserIcon}
      />
      {user && open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full right-0 z-30 mt-1 w-44 overflow-hidden",
            "rounded-md border border-rule-strong bg-paper py-1 shadow-lg",
          )}
        >
          <p className="m-0 truncate px-3 py-1 text-xs text-muted">
            {user.username}
          </p>
          {user.role === "admin" && (
            <Link
              to="/backoffice"
              role="menuitem"
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 border-0",
                "bg-transparent px-3 py-2 text-left text-[13px] text-ink",
                "no-underline hover:bg-accent-soft hover:text-accent",
              )}
              onClick={() => setOpen(false)}
            >
              <ShieldIcon size={16} />
              Back office
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 border-0",
              "bg-transparent px-3 py-2 text-left text-[13px] text-ink",
              "no-underline hover:bg-accent-soft hover:text-accent",
            )}
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
          >
            <LogOutIcon size={16} />
            Sign out
          </button>
        </div>
      )}
      {signingIn && !user && (
        <AccountModal onClose={() => setSigningIn(false)} />
      )}
    </div>
  );
};

export const AccountButton: FC<{
  variant: "header" | "sidebar";
}> = ({ variant }) => {
  if (!isUserFlowEnabled) return null;
  return variant === "header" ? <HeaderAccountMenu /> : <SidebarAccountItems />;
};
