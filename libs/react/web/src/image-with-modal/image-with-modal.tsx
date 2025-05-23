import { useState } from "react";
import { default as Image } from "next/image";
import { Sheet, Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { useDisclose } from "../hooks/use-disclose";
import { Ups } from "../ups";
import type { SheetProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type ImageWithModalProps = {
  href: string;
  alt: string;
  width: number;
  height: number;
} & Pick<SheetProps, "sx" | "ref">;

/**
 * Image component that, when clicks, pops out a modal with an image as big
 * as it can possibly be.
 */
export const ImageWithModal: FunctionComponent<ImageWithModalProps> = ({
  href,
  alt,
  width,
  height,
  ...otherProps
}) => {
  const [error, setError] = useState(false);
  const imageModal = useDisclose();

  return (
    <Sheet
      {...otherProps}
      sx={{
        width,
        height,
        p: 0.5,
        cursor: "pointer",
        backgroundColor: "background.paper",
        "& > img": { objectFit: "contain" },
        ...otherProps.sx,
      }}
    >
      {error ? (
        <Ups
          sx={{
            flex: "initial",
            width: "100%",
            height: "100%",
            minHeight: 0,
            "& svg": {
              width: width / 2,
              height: height / 2,
            },
            "& h3": {
              fontSize: "18px",
            },
          }}
          message="Not Found"
        />
      ) : (
        <Image
          onClick={imageModal.open}
          src={href}
          alt={alt}
          width={width - 10}
          height={height - 10}
          onError={() => setError(true)}
        />
      )}
      <Modal open={imageModal.isOpen} onClose={imageModal.close}>
        <ModalDialog>
          <ModalClose variant="solid" />
          <Stack>
            <img
              src={href}
              alt={alt}
              style={{
                objectFit: "contain",
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
              }}
            />
          </Stack>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
};
