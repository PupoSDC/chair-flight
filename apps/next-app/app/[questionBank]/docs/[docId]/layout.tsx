"use client";

import {
  Chip,
  Drawer,
  ModalClose,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { AppHeader, ModulesMain } from "@cf/next/ui";
import { useDisclose, useMediaQuery } from "@cf/react/ui";
import type { FunctionComponent, ReactNode } from "react";

type Props = {
  drawerLearningObjectives: ReactNode;
  drawerQuestions: ReactNode;
  docHeader: ReactNode;
  docChildren: ReactNode;
  docContent: ReactNode;
  docFooter: ReactNode;
};

const Page: FunctionComponent<Props> = ({
  drawerLearningObjectives,
  drawerQuestions,
  docHeader,
  docContent,
  docChildren,
  docFooter,
}) => {
  const theme = useTheme();
  const loDrawer = useDisclose(false);
  const questionDrawer = useDisclose(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerToggles = (
    <Stack
      spacing={1}
      width={"100%"}
      marginBottom={2}
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start" }}
    >
      <Chip color="primary" onClick={loDrawer.open}>
        Learning Objectives
      </Chip>
      <Chip color="primary" onClick={questionDrawer.open}>
        Questions
      </Chip>
    </Stack>
  );

  return (
    <ModulesMain>
      <Stack
        sx={{
          mx: "auto",
          minHeight: `calc(100vh - ${AppHeader.height}px)`,
          width: "100%",
          maxWidth: "md",
        }}
      >
        {docHeader}
        {drawerToggles}
        {docChildren}
        {docContent}
        {docFooter}
      </Stack>

      <Drawer
        anchor="right"
        size="lg"
        open={loDrawer.isOpen}
        onClose={loDrawer.close}
      >
        {isMobile && <ModalClose />}
        <Stack sx={{ p: 1 }}>
          <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
            Learning Objectives
          </Typography>
          {drawerLearningObjectives}
        </Stack>
      </Drawer>

      <Drawer
        anchor="right"
        size="lg"
        open={questionDrawer.isOpen}
        onClose={questionDrawer.close}
      >
        {isMobile && <ModalClose />}

        <Stack sx={{ p: 1 }}>
          <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
            Questions
          </Typography>
          {drawerQuestions}
        </Stack>
      </Drawer>
    </ModulesMain>
  );
};

export default Page;
