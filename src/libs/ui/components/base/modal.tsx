import { useEffect, useRef } from "react";
import { CloseIcon } from "../../icons/close-icon";
import { cn } from "../../utils/cn";
import { IconButton } from "./icon-button";
import type { FC, ReactNode } from "react";

const SIZE_CLASS_NAMES = {
  md: "w-[min(32rem,calc(100vw-2rem))]",
  lg: "w-[min(38rem,calc(100vw-2rem))]",
  xl: "w-[min(64rem,calc(100vw-2rem))]",
  full: "w-[calc(100vw-2rem)]",
};

export const Modal: FC<{
  title: string;
  size?: keyof typeof SIZE_CLASS_NAMES;
  bare?: boolean;
  footer?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}> = ({ title, size = "md", bare = false, footer, onClose, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        "m-auto overflow-hidden rounded-xl border bg-paper p-0",
        "text-ink backdrop:bg-black/60",
        bare
          ? "max-h-[calc(100dvh-1rem)] w-fit max-w-[calc(100vw-1rem)] border-rule"
          : cn(
              "max-h-[calc(100dvh-2rem)] max-w-none border-rule-strong",
              SIZE_CLASS_NAMES[size],
            ),
      )}
    >
      {bare ? (
        <div className="relative">
          {children}
          <IconButton
            label="Close"
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
          >
            <CloseIcon />
          </IconButton>
        </div>
      ) : (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div
            className={cn(
              "flex items-center justify-between gap-4 border-b",
              "border-rule px-4 py-3",
            )}
          >
            <h2 className="m-0 text-base font-bold">{title}</h2>
            <IconButton label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
          {footer && (
            <div className="border-t border-rule px-4 py-3">{footer}</div>
          )}
        </div>
      )}
    </dialog>
  );
};
