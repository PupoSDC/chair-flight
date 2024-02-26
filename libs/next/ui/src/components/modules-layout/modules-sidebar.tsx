"use client";

import { forwardRef } from "react";
import { usePathname } from "next/navigation";
import { listItemContentClasses } from "@mui/joy";
import { AppLogo, SidebarListItem } from "@cf/react/ui";
import type { SidebarListItemProps } from "@cf/react/ui";
import type { FunctionComponent } from "react";

export const ModulesSidebarHomeItem: FunctionComponent = () => (
  <SidebarListItem
    href={"/"}
    key="logo"
    icon={AppLogo}
    title="Chair Flight"
    sx={{
      height: (t) => t.spacing(6),
      pl: 0.5,
      svg: {
        fill: (t) => t.vars.palette.primary.plainColor,
        fontSize: 24,
        marginLeft: "-2px",
      },
      [`& .${listItemContentClasses.root}`]: {
        fontWeight: 700,
        letterSpacing: "0.05rem",
        color: (t) => t.vars.palette.text.primary,
      },
    }}
  />
);

export const ModulesSidebarListItem = forwardRef<
  HTMLAnchorElement,
  Omit<SidebarListItemProps, "selected">
>((props, ref) => {
  // TODO remove cast after migrating to APP dir
  const pathName = usePathname() as string;
  return (
    <SidebarListItem
      {...props}
      ref={ref}
      selected={pathName.match(new RegExp(`^${props.href}`)) !== null}
    />
  );
});

ModulesSidebarListItem.displayName = "ModulesSidebarListItem";
