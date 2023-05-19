import { useRouter } from "next/router";
import { Modal, Typography } from "@mui/joy";
import { useAppSelector } from "@chair-flight/core/redux";
import { toast } from "@chair-flight/react/components";
import { EditVariantModalDialog } from "./edit-variant-modal-dialog";
import type { FunctionComponent } from "react";

export const EditVariantModal: FunctionComponent = () => {
  const router = useRouter();
  const questionId = router.query["questionId"] as string;
  const variantId = router.query["variantId"] as string;

  const variant = useAppSelector(
    (state) =>
      state?.questionEditor?.questions[questionId]?.currentVersion?.variants[
        variantId
      ]
  );

  const disableCloseWithoutAction = () => {
    toast.warn("Please save or discard your changes!");
  };

  return (
    <Modal open={!!variantId} onClose={disableCloseWithoutAction}>
      {variant ? (
        <EditVariantModalDialog questionId={questionId} variant={variant} />
      ) : (
        <Typography level="h5">loading...</Typography>
      )}
    </Modal>
  );
};
