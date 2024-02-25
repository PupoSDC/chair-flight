"use client"

import { Sidebar } from "@cf/react/components"

import { TabPanel, TabPanelProps } from "@mui/joy"
import { forwardRef } from "react"

export const ModulesTabPanel = forwardRef<HTMLDivElement, TabPanelProps>((props, ref) => (
    <TabPanel
        {...props}
        ref={ref}
        sx={{
            width: Sidebar.css.remainingWidth,
            transition: Sidebar.css.widthTransition,
            ml: "auto",
            ...props.sx
        }}
    />
));