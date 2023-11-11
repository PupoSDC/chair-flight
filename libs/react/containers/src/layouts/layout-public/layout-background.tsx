import { default as Image } from "next/image";
import { Box } from "@mui/joy";
import type { FunctionComponent } from "react";

export type BackgroundImageContainerProps = {
  src: string;
  alt: string;
};

export const LayoutBackground: FunctionComponent<
  BackgroundImageContainerProps
> = ({ src, alt }) => {
  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: -1,
        "& > img": {
          userSelect: "none",
          width: "600px",
          maxWidth: "600px",
          height: "auto",
          mask: "linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent) top right / cover",
        },
      }}
    >
      <Image src={src} fill alt={alt} />
    </Box>
  );
};
