import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { LogOutIcon } from "../../icons/log-out-icon";
import { ShieldIcon } from "../../icons/shield-icon";
import { UserIcon } from "../../icons/user-icon";
import { cn } from "../../utils/cn";
import { AccountModal } from "./account-modal";
import type { FC } from "react";

export const SidebarAccountItems: FC<{ showBackoffice?: boolean }> = ({
  showBackoffice = true,
}) => {
  const { user, status, signOut } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  if (!user) {
    return (
      <>
        <button
          type="button"
          disabled={status === "loading"}
          className={cn(
            "flex flex-none cursor-pointer items-center gap-3 border-0",
            "border-t border-l-4 border-rule border-l-transparent",
            "bg-transparent p-2 text-sm whitespace-nowrap text-ink",
            "no-underline hover:text-accent",
          )}
          onClick={() => setSigningIn(true)}
        >
          <UserIcon size={20} className="flex-none" />
          <span>Sign in</span>
        </button>
        {signingIn && <AccountModal onClose={() => setSigningIn(false)} />}
      </>
    );
  }

  return (
    <>
      {showBackoffice && user.role === "admin" && (
        <Link
          to="/backoffice"
          className={cn(
            "flex flex-none cursor-pointer items-center gap-3 border-0",
            "border-t border-l-4 border-rule border-l-transparent",
            "bg-transparent p-2 text-sm whitespace-nowrap text-ink",
            "no-underline hover:text-accent",
          )}
        >
          <ShieldIcon size={20} className="flex-none" />
          <span>Back office</span>
        </Link>
      )}
      <button
        type="button"
        className={cn(
          "flex flex-none cursor-pointer items-center gap-3 border-0",
          "border-t border-l-4 border-rule border-l-transparent",
          "bg-transparent p-2 text-sm whitespace-nowrap text-ink",
          "no-underline hover:text-accent",
        )}
        onClick={() => signOut()}
      >
        <LogOutIcon size={20} className="flex-none" />
        <span>Sign out</span>
      </button>
    </>
  );
};
