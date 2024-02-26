"use client";

import { Sidebar } from "@cf/react/ui";
import { AppHeader, AppMain } from "../app-layout";
import type { AppMainProps } from "../app-layout";
import type { FunctionComponent, ReactNode } from "react";

export type ModulesMainProps = {
  children: ReactNode;
  fixedHeight?: boolean;
  sx?: AppMainProps["sx"];
};

export const ModulesMain: FunctionComponent<ModulesMainProps> = ({
  children,
  fixedHeight = false,
  sx,
}) => {
  return (
    <AppMain
      sx={{
        width: Sidebar.css.remainingWidth,
        transition: Sidebar.css.widthTransition,
        marginLeft: "auto",
        marginRight: 0,
        maxWidth: "initial",
        flex: "initial",
        ...(fixedHeight
          ? { height: `calc(100vh - ${AppHeader.height}px)` }
          : {}),
        ...sx,
      }}
    >
      {children}
    </AppMain>
  );
};
