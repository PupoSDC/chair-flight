import { Typography } from "@mui/joy";
import type { TypographyProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type AppTitleProps = TypographyProps;

export const AppTitle: FunctionComponent<AppTitleProps> = ({
  component = "span",
  children = "Chair Flight",
  sx,
  ...props
}) => (
  <Typography
    component={component}
    children={children}
    sx={{
      fontSize: "16px",
      fontWeight: 700,
      letterSpacing: "0.05rem",
      color: ({ vars }) => vars.palette.neutral.plainColor,
      ...sx,
    }}
    {...props}
  />
);
