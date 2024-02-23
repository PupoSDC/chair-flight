"use client";

import { Sidebar } from "@cf/react/components";
import { Box, Link, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    explanation: ReactNode;
}

export default ({ explanation }: Props) => {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") ?? "question";

    return (
        <Tabs value={tab}>
            <TabList
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
                }}
            >
                <Tab component={Link} href="?tab=question" value={"question"}>Question</Tab>
                <Tab component={Link} href="?tab=explanation" value={"explanation"}>Explanation</Tab>
                <Tab component={Link} href="?tab=meta" value={"meta"}>Meta</Tab>
            </TabList>
            <Box sx={{ height: 41 }} />

            <TabPanel value={"question"}>

            </TabPanel>

            <TabPanel value={"explanation"}>
                {explanation}
                <h1>Potato</h1>
            </TabPanel>

            <TabPanel value={"meta"}>

            </TabPanel>
        </Tabs>
    );
}