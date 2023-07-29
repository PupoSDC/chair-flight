import { useRouter } from "next/router";
import { Modal, ModalDialog } from "@mui/joy";
import type { FunctionComponent } from "react";

export const ReviewPrModal: FunctionComponent = () => {
  const router = useRouter();
  const isOpen = router.query["modal"] === "review";

  // const form = useFormContext<QuestionTemplate>();

  return (
    <Modal open={isOpen}>
      <ModalDialog></ModalDialog>
    </Modal>
  );
};
