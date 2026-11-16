import { CloseIcon } from "../../icons/close-icon";
import { cn } from "../../utils/cn";
import { ButtonIcon } from "./button-icon";
import type { FC, ReactNode } from "react";

export const Drawer: FC<{
  title: string;
  open: boolean;
  width?: number;
  onClose: () => void;
  children: ReactNode;
}> = ({ title, open, width = 460, onClose, children }) => {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-250",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label={title}
        aria-hidden={!open}
        inert={!open}
        style={{ maxWidth: width }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col",
          "border-l border-rule bg-paper transition-transform duration-250",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex h-12 flex-none items-center justify-between gap-4",
            "border-b border-rule px-4",
          )}
        >
          <h2 className="m-0 text-base font-bold">{title}</h2>
          <ButtonIcon label="Close" onClick={onClose} icon={CloseIcon} />
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
      </aside>
    </>
  );
};
