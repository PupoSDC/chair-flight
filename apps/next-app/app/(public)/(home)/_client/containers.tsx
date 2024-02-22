"use client";

import { keyframes } from "@emotion/react";
import { Stack } from "@mui/joy";
import { AppHeader } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export const MEDIA_LONG_SCREEN =
  "@media (min-height: 560px) and (min-width: 440px)";

export const LeftContainer: FunctionComponent<StackProps> = (props) => (
  <Stack
    {...props}
    sx={{
      mx: "auto",
      alignItems: "flex-start",

      justifyContent: {
        xs: "space-around",
        md: "center",
      },
      minHeight: {
        xs: `calc(100vh - ${AppHeader.height}px - 16px)`,
        md: `calc(100vh - ${AppHeader.height}px - 32px)`,
      },
      maxWidth: {
        xs: 620,
        md: "calc(460px - 16px)",
        lg: "calc(620px - 16px)",
      },
      position: {
        xs: "relative",
        md: "absolute",
      },
      top: {
        xs: "initial",
        md: "50%",
      },
      transform: {
        xs: "none",
        md: `translate(0, -50%)`,
      },
      "& > *": {
        mb: 1,
        [MEDIA_LONG_SCREEN]: { mb: 2 },
      },
      "& h1": {
        lineHeight: 1.2,
        [MEDIA_LONG_SCREEN]: { fontSize: "3em" },
      },
    }}
  />
);

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const RightContainer: FunctionComponent<StackProps> = (props) => (
  <Stack
    {...props}
    sx={(t) => ({
      alignItems: "flex-start",
      mx: "auto",
      width: "100%",
      minHeight: {
        xs: `calc(100vh - ${AppHeader.height}px - ${t.spacing(2)})`,
        md: `calc(100vh - ${AppHeader.height}px - ${t.spacing(4)})`,
      },
      margin: {
        xs: "auto",
        md: "0 0 0 auto",
      },
      justifyContent: {
        xs: "space-around",
        md: "center",
      },
      maxWidth: {
        xs: 620,
        md: `calc(100% - ${460}px - ${t.spacing(2)})`,
        lg: `calc(100% - ${620}px - ${t.spacing(2)})`,
      },

      "& > *": {
        animation: `${fadeIn} 0.5s ease-in`,
      },
    })}
  ></Stack>
);

export const MainContainer: FunctionComponent<StackProps> = ({
  component = "main",
  ...props
}) => (
  <Stack
    {...props}
    component={component}
    direction="row"
    sx={{
      p: { xs: 2, md: 4 },
      flexDirection: { xs: "column", md: "row" },
      height: { xs: "100%", md: `calc(100vh - ${AppHeader.height}px)` },
      maxWidth: 1280,
      width: "100%",
      mx: "auto",
      position: "relative",
    }}
  />
);
