"use client";
import { HTMLAttributes, ReactNode, forwardRef, useEffect } from "react"
import { cn } from "../../utils/cn";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useSidebarStore } from "../../hooks/use-sidebar";
import { default as Link } from "next/link";

export const AppSidebar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const isDesktopOpen = useSidebarStore((s) => s.isDesktopOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  useEffect(() => {
    document.body.style.setProperty(
      "--sidebar-desktop-width",
      isDesktopOpen
        ? "var(--sidebar-expanded-width)"
        : "var(--sidebar-collapsed-width)"
    );
    document.body.style.setProperty(
      "--sidebar-mobile-width",
      isMobileOpen
        ? "var(--sidebar-expanded-width)"
        : "0px"
    );
  }, [isMobileOpen, isDesktopOpen]);

  return (
    <>
      <nav
        {...props}
        ref={ref}
        onClick={() => useSidebarStore.getState().setMobileOpen(!isMobileOpen)}
        className={cn(
          "flex flex-col",
          "w-[var(--sidebar-mobile-width)]",
          "md:w-[var(--sidebar-desktop-width)]",
          "h-full",
          "fixed top-0 left-0 z-50",
          "border-r",
          "overflow-y-auto, overflow-x-hidden",
          props.className
        )}
      >
        {props.children}
      </nav>
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 right-0 backdrop-blur-sm bg-black/30",
          "z-[49]",
          "blur-md",
          isMobileOpen ? "block" : "hidden",
          "md:hidden"
        )}
        aria-hidden
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
});

export const AppSidebarLink = forwardRef<
  HTMLAnchorElement,
  Omit<HTMLAttributes<HTMLAnchorElement>, "children" | "href"> & {
    title: ReactNode;
    icon: ReactNode;
    href: string;
  }
>((props, ref) => {
  return (
    <Link
      {...props}
      ref={ref}
      className={cn(
        "flex items-center",
        "h-10 p-2 pl-0 min-w-min flex",
        "overflow-hidden text-nowrap",
        "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:mx-[10px]",
        "span:pl-1",
        "border-b",
        props.className
      )}
    >
      {props.icon}
      <span>{props.title}</span>
    </Link>
  );
});

export const AppSidebarCollapseButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const isDesktopOpen = useSidebarStore(s => s.isDesktopOpen)
  const setDesktopOpen = useSidebarStore(s => s.setDesktopOpen)
  const setMobileOpen = useSidebarStore(s => s.setMobileOpen)

  return (
    <button
      {...props}
      ref={ref}
      onClick={() => {
        setDesktopOpen(!isDesktopOpen);
        setMobileOpen(false);
      }}
      className={cn(
        "flex items-center",
        "h-10 p-2 pl-0 min-w-min flex",
        "overflow-hidden text-nowrap",
        "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:mx-[10px]",
        "border-t",
      )}
    >
      <ChevronLeftIcon
        className={cn(
          "transition-rotate duration-300 ease-in-out",
          isDesktopOpen ? "" : "md:rotate-180"
        )}
      />
      <span>Collapse</span>
    </button>
  );
});