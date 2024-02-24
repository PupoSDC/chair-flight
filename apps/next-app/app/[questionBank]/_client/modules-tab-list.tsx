"use client"

import { Sidebar } from "@cf/react/components"

import { Box, TabList, TabListProps, tabClasses } from "@mui/joy"
import { FunctionComponent } from "react"

export const ModulesTabList: FunctionComponent<TabListProps> = (props) => (
    <>
        <TabList
            {...props}
            sx={{
                position: "fixed",
                bgcolor: "background.surface",
                height: 41,
                width: Sidebar.css.remainingWidth,
                transition: Sidebar.css.widthTransition,
                right: 0,

                [`& .${tabClasses.selected}`]: {
                    color: "primary.plainColor",
                },
                ...props.sx
            }}
        />
        <Box sx={{ height: 41 }} />
    </>
);