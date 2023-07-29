import { forwardRef, useEffect, useState } from "react";
import { Modal, Sheet, styled } from "@mui/joy";
import type { ModalProps, SheetProps } from "@mui/joy";
import type { PropsWithChildren } from "react";

export type DrawerProps = Omit<SheetProps, "color" | "invertedColors"> &
  PropsWithChildren<{
    open?: boolean;
    onClose?: ModalProps["onClose"];
  }>;

const TRANSITION_DURATION = 250;

const StyledSheet = styled(Sheet)`
  height: 100%;
  width: 350px;
  max-width: 90vw;
  overflow: auto;
  border-radius: 0;
  transform: translateX(-100%);
  padding: ${({ theme }) => theme.spacing(2)};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  border-top: 0;
  border-bottom: 0;
  border-left: 0;

  &.slide-in {
    animation: slide-in ${TRANSITION_DURATION}ms forwards;
    -webkit-animation: slide-in ${TRANSITION_DURATION}ms forwards;
  }

  &.slide-out {
    animation: slide-out ${TRANSITION_DURATION}ms forwards;
    -webkit-animation: slide-out ${TRANSITION_DURATION}ms forwards;
  }

  @keyframes slide-in {
    100% {
      transform: translateX(0%);
    }
  }

  @-webkit-keyframes slide-in {
    100% {
      -webkit-transform: translateX(0%);
    }
  }

  @keyframes slide-out {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @-webkit-keyframes slide-out {
    0% {
      -webkit-transform: translateX(0%);
    }
    100% {
      -webkit-transform: translateX(-100%);
    }
  }
`;

/**
 * A temporary drawer component that we will hopefully replace with @joy/ui
 * Drawer component whenever that is released
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    { open = false, variant = "outlined", onClose, className, ...props },
    ref,
  ) => {
    const [delayedOpen, setDelayedOpen] = useState(false);
    useEffect(() => {
      if (open && !delayedOpen) {
        setDelayedOpen(true);
      }
      if (!open && delayedOpen) {
        setTimeout(() => setDelayedOpen(false), TRANSITION_DURATION);
      }
    }, [open, delayedOpen]);

    return (
      <Modal ref={ref} open={delayedOpen} onClose={onClose}>
        <StyledSheet
          {...props}
          variant={variant}
          className={[className, open ? "slide-in" : "slide-out"].join(" ")}
        />
      </Modal>
    );
  },
);

Drawer.displayName = "Drawer";
