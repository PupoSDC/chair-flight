import { default as Image } from "next/image";
import { Box } from "@mui/joy";
import { default as article } from "./images/background-article.png";
import { default as testCreation } from "./images/background-test-creation.png";
import type { FunctionComponent } from "react";

const backgroundImages = {
  testCreation,
  article,
};

export type BackgroundImageContainerProps = {
  img: keyof typeof backgroundImages;
};

export const BackgroundFadedImage: FunctionComponent<
  BackgroundImageContainerProps
> = ({ img }) => {
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
      <Image src={backgroundImages[img]} fill alt={""} />
    </Box>
  );
};
