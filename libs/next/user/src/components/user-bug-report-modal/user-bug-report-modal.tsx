"use client";

import { default as dynamic } from "next/dynamic";
import { Modal, ModalClose, ModalDialog, Skeleton, Stack } from "@mui/joy";
import { useBugReportDisclose } from "../../hooks/use-bug-report";

const DynamicUserBugReportForm = dynamic(
  () => import("../user-bug-report-form").then((mod) => mod.UserBugReportForm),
  {
    ssr: false,
    loading: () => (
      <Stack>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" level="h1" width="100%" />
        <Skeleton variant="text" level="h1" width="100%" />
        <Skeleton variant="text" level="h1" width="100%" />
        <Skeleton variant="text" level="h1" width="100%" />
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ pt: 2 }}
          height={200}
        />
      </Stack>
    ),
  },
);

export const UserBugReportModal = () => {
  const disclose = useBugReportDisclose();

  return (
    <Modal open={disclose.isOpen} onClose={disclose.close}>
      <ModalDialog sx={{ width: "calc(100% - 16px)", maxWidth: "md" }}>
        <ModalClose />
        <DynamicUserBugReportForm />
      </ModalDialog>
    </Modal>
  );
};
