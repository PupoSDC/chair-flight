import React, {
  useState,
  type FunctionComponent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, LinearProgress, Snackbar, Stack } from "@mui/joy";
import { create } from "zustand";
import { useDisclose } from "../hooks/use-disclose";
import type { ButtonProps, SnackbarProps } from "@mui/joy";

type Toast = {
  content: ReactNode;
  timeout?: number;
  variant?: SnackbarProps["variant"];
  color?: SnackbarProps["color"];
  startDecorator?: SnackbarProps["startDecorator"];
  onAutoClose?: () => void;
  action?: {
    startDecorator?: ButtonProps["startDecorator"];
    onClick: () => void;
    text: ReactNode;
  };
};

const useToasterStore = create<{
  toast: Toast | undefined;
  setToast: (toast: Toast) => void;
  popToast: () => Toast | undefined;
}>((set, get) => ({
  toast: undefined,
  setToast: (toast) => set({ toast }),
  popToast: () => {
    const toast = get().toast;
    set({ toast: undefined });
    return toast;
  },
}));

const wait = (t: number) => new Promise((r) => setTimeout(r, t));

export const Toaster: FunctionComponent = () => {
  const disclose = useDisclose();
  const popToast = useToasterStore((t) => t.popToast);
  const toast = useToasterStore((t) => t.toast);
  const currentToast = useRef<Toast | undefined>(undefined);
  const [percentageLeft, setPercentageLeft] = useState(0);

  const showToast = async () => {
    const newToast = popToast();
    if (currentToast.current) await hideToast();
    if (!newToast) return;

    currentToast.current = newToast;
    const startTime = Date.now();
    const duration = newToast.timeout ?? 5000;
    const endTime = startTime + duration;

    disclose.open();

    while (Date.now() < endTime) {
      if (newToast !== currentToast.current) return;
      await wait(1000 / 60);
      const bar = Math.max((endTime - Date.now()) / duration, 0) * 100;
      setPercentageLeft(bar);
    }

    newToast.onAutoClose?.();
    hideToast();
  };

  const hideToast = async () => {
    disclose.close();
    await wait(250);
    currentToast.current = undefined;
  };

  useEffect(() => {
    if (toast) showToast();
  });

  const color = currentToast.current?.color ?? "primary";
  const variant = currentToast.current?.variant ?? "outlined";

  return (
    <Snackbar
      open={disclose.isOpen}
      variant={variant}
      color={color}
      sx={{ borderRadius: 0, pb: 3 }}
      endDecorator={
        <IconButton
          size="sm"
          onClick={hideToast}
          color={color}
          children={<CloseIcon />}
        />
      }
    >
      <Stack sx={{ pr: 2 }}>
        {currentToast.current?.content}
        {currentToast.current?.action && (
          <Button
            variant="outlined"
            color={color}
            startDecorator={currentToast.current?.action.startDecorator}
            sx={{ mt: 2 }}
            onClick={() => {
              currentToast.current?.action?.onClick?.();
              hideToast();
            }}
          >
            {currentToast.current?.action.text}
          </Button>
        )}
      </Stack>
      <LinearProgress
        color={color}
        variant="plain"
        determinate
        value={percentageLeft}
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          ml: "-16px",
          "--LinearProgress-radius": "0px",
        }}
      />
    </Snackbar>
  );
};

export const toast = useToasterStore.getState().setToast;
