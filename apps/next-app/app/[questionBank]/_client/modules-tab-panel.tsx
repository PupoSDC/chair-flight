"use client"

import { Sidebar } from "@cf/react/components"

import { Box, TabPanel, TabPanelProps, tabClasses } from "@mui/joy"
import { FunctionComponent } from "react"

export const ModulesTabPanel: FunctionComponent<TabPanelProps> = (props) => (
    <>
        <TabPanel
            {...props}
            sx={{
                width: Sidebar.css.remainingWidth,
                transition: Sidebar.css.widthTransition,
                ml: "auto",
            }}
        />
    </>
);