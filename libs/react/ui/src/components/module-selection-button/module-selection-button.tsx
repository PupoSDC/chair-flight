import { forwardRef, useEffect, useState } from "react";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import {
  Box,
  Button,
  Link,
  Typography,
  buttonClasses,
  useColorScheme,
} from "@mui/joy";
import type { ButtonProps } from "@mui/joy";
import type { ReactNode } from "react";

export type ModuleSelectionButtonProps = {
  color: "blue" | "teal" | "rose";
  title: string;
  icon: ReactNode;
  description: ReactNode;
  showMoreHref?: string;
  active?: boolean;
} & Omit<ButtonProps, "color" | "children" | "startDecorator" | "endDecorator">;

export const ModuleSelectionButton = forwardRef<
  HTMLButtonElement,
  ModuleSelectionButtonProps
>(
  (
    { color, title, icon, active, description, showMoreHref, ...props },
    ref,
  ) => {
    const { mode } = useColorScheme();
    const [delayedMode, setDelayedMode] = useState<typeof mode>("light");
    const capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
    const primaryColor = `--joy-palette-primary${capitalColor}`;
    const bgWeight = delayedMode === "dark" ? 800 : 200;

    useEffect(() => setDelayedMode(mode), [mode]);

    return (
      <Button
        ref={ref}
        role="button"
        component="div"
        variant="plain"
        startDecorator={icon}
        {...props}
        sx={(t) => ({
          color: "text.primary",
          border: "solid 1px transparent",
          textAlign: "left",
          "--button-bg": `var(${primaryColor}-${bgWeight})`,
          "--button-border": `var(${primaryColor}-500)`,
          "--button-highlight": `var(${primaryColor}-700)`,
          "&:hover": {
            bgcolor: `var(--button-bg)`,
            border: `1px solid var(--button-border)`,
          },
          [t.breakpoints.down("sm")]: {
            p: 1,
          },
          [t.breakpoints.down("sm")]: {
            [`& .${buttonClasses.startDecorator}`]: {
              display: "none",
            },
          },
          [`& .${buttonClasses.startDecorator}`]: {
            color: `var(${primaryColor}-500)`,
            p: 2,
          },
          [`& .${buttonClasses.startDecorator} svg`]: {
            fontSize: "32px",
          },
          ...(active && {
            boxShadow: `0px 1px 4px 
                        var(--button-border),
                        inset 0px 2px 4px rgba(194, 224, 255, 0.5)
                    `,
            bgcolor: `var(--button-bg)`,
            border: `1px solid var(--button-border)`,
          }),
          // TODO fix this cast.
          ...(props.sx as unknown as object),
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Typography level="body-md" component="span">
            {title}
          </Typography>
          <Typography level="body-xs" component="span">
            {description}
          </Typography>
          {showMoreHref && (
            <Link
              href={showMoreHref}
              onClick={(e) => e.stopPropagation()}
              endDecorator={<ChevronRightIcon />}
              sx={{
                fontSize: "sm",
                mt: 1,
                color: `var(${primaryColor}-500)`,
                textDecorationColor: `var(${primaryColor}-500)`,
              }}
            >
              Show more
            </Link>
          )}
        </Box>
      </Button>
    );
  },
);

ModuleSelectionButton.displayName = "ModuleSelectionButton";
