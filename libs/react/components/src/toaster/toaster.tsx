import { Global, css } from "@emotion/react";
import WarningIcon from "@mui/icons-material/Warning";
import { useTheme } from "@mui/joy";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import type { FunctionComponent } from "react";

/**
 * A thin wrapper over Sonner Toaster component that applies a joy UI feeling
 * to the components
 * @returns
 */
export const Toaster: FunctionComponent = () => {
  const theme = useTheme();

  return (
    <>
      <Global
        styles={css`
          .sonner-toast {
            --normal-bg: ${theme.vars.palette.primary.softBg};
            --normal-border: ${theme.vars.palette.primary.outlinedBorder};
            --normal-text: ${theme.vars.palette.text.primary};
            --success-bg: ${theme.vars.palette.success.solidBg};
            --success-border: ${theme.vars.palette.success.outlinedBorder};
            --success-text: ${theme.vars.palette.success.solidColor};
            --error-bg: ${theme.vars.palette.danger.solidBg};
            --error-border: ${theme.vars.palette.danger.outlinedBorder};
            --error-text: ${theme.vars.palette.danger.solidColor};
            font-family: ${theme.fontFamily};
            font-size: ${theme.fontSize.md};
          }

          .sonner-toast-warn {
            --normal-bg: ${theme.vars.palette.warning.solidBg};
            --normal-border: ${theme.vars.palette.warning.outlinedBorder};
            --normal-text: ${theme.vars.palette.warning.solidColor};
          }
        `}
      />
      <SonnerToaster
        richColors
        closeButton
        toastOptions={{
          className: "sonner-toast",
        }}
      />
    </>
  );
};

type Toast = typeof sonnerToast & {
  warn: typeof sonnerToast.error;
};

const toast: Toast = sonnerToast as Toast;
toast.warn = (message, data) =>
  sonnerToast(message, {
    ...data,
    className: "sonner-toast sonner-toast-warn",
    icon: <WarningIcon sx={{ color: "white" }} />,
  });

export { toast };
