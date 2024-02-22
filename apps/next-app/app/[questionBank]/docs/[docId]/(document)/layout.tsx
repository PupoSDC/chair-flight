"use client";

import { Drawer, ModalClose, Typography } from "@mui/joy";
import { useDisclose } from "@cf/react/components";
import { ModulesMain } from "../../../_client/modules-main";
import type { FunctionComponent, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  learningObjectives: ReactNode;
  questions: ReactNode;
};

const Layout: FunctionComponent<LayoutProps> = ({
  children,
  learningObjectives,
  questions,
}) => {
  const questionsDrawer = useDisclose();
  const learningObjectivesDisclose = useDisclose();

  return (
    <ModulesMain>
      {children}
      <Drawer
        anchor="right"
        size="lg"
        open={learningObjectivesDisclose.isOpen}
        onClose={learningObjectivesDisclose.close}
      >
        <ModalClose />
        <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
          Learning Objectives
        </Typography>
        {learningObjectives}
      </Drawer>
      <Drawer
        anchor="right"
        size="lg"
        open={questionsDrawer.isOpen}
        onClose={questionsDrawer.close}
      >
        <ModalClose />
        <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
          Questions
        </Typography>
        {questions}
      </Drawer>
    </ModulesMain>
  );
};

export default Layout;
