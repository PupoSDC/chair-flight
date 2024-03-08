"use client";

import {
  Box,
  DialogContent,
  DialogTitle,
  Drawer,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useBugReportDebugData } from "@cf/next/user";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import { useDisclose } from "@cf/react/ui";
import { useEffectTestProgress } from "../../hooks/use-effect-test-progress";
import { useEffectTestHotkeys } from "../../hooks/use-effect-test-progress-hotkeys";
import { useTestProgress } from "../../hooks/use-test-progress";
import { TestFinisher } from "./test-finisher";
import { TestHeader } from "./test-header";
import { TestNavigation } from "./test-navigation";
import { TestQuestion } from "./test-question";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent, ReactNode } from "react";

export type TestProps = {
  testId: string;
  meta?: ReactNode;
  component?: BoxProps["component"];
  sx?: BoxProps["sx"];
  finishedUrl?: string;
};

export const TestStandAlone: FunctionComponent<TestProps> = ({
  testId,
  meta,
  component = "div",
  sx,
}) => {
  const test = useTestProgress((s) => s.getTest({ testId }));
  const question = useTestProgress((s) => s.getCurrentQuestion({ testId }));
  const metaDisclose = useDisclose();
  const navigationDisclose = useDisclose();
  const finishTestDisclose = useDisclose();
  const mode = test.mode;
  const questionBank = test.questionBank;

  useEffectTestProgress({ testId });
  useEffectTestHotkeys({ testId });
  useBugReportDebugData("test-current-question", () => question);
  useBugReportDebugData("test", () => test);

  return (
    <Box component={component} sx={sx}>
      <ThemeOverrideColorScheme questionBank={questionBank} />

      <TestHeader
        testId={testId}
        onQuestionsClicked={navigationDisclose.open}
        onMetaClicked={metaDisclose.open}
        onFinishClicked={finishTestDisclose.open}
      />
      <TestQuestion testId={testId} component="main" />
      <Drawer
        anchor="right"
        open={navigationDisclose.isOpen}
        onClose={navigationDisclose.close}
        sx={{ "--Drawer-horizontalSize": "440px" }}
      >
        <ModalClose />
        <DialogTitle>Question Navigation</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <TestNavigation
            testId={testId}
            onNavigation={navigationDisclose.close}
          />
        </DialogContent>
      </Drawer>
      <Modal
        open={finishTestDisclose.isOpen}
        onClose={finishTestDisclose.close}
      >
        <ModalDialog>
          <ModalClose />
          <DialogContent sx={{ p: 2 }}>
            <TestFinisher testId={testId} />
          </DialogContent>
        </ModalDialog>
      </Modal>
      {mode === "study" && (
        <Drawer
          anchor="right"
          open={metaDisclose.isOpen}
          onClose={metaDisclose.close}
          sx={{ "--Drawer-horizontalSize": "880px" }}
        >
          <ModalClose />
          <DialogTitle>Question</DialogTitle>
          <DialogContent sx={{ p: 2 }}>{meta}</DialogContent>
        </Drawer>
      )}
    </Box>
  );
};
