import { default as Image } from "next/image";
import { Box, styled } from "@mui/joy";
import { getRandomShuffler } from "@chair-flight/core/app";
import { HEADER_HEIGHT } from "@chair-flight/react/components";
import { default as HomeAeroplane } from "./images/home-aeroplane.png";
import { default as HomeCessna } from "./images/home-cessna.png";
import { default as HomeCockpit } from "./images/home-cockpit.png";
import { default as HomeEngine } from "./images/home-engine.png";
import { default as HomeFighter } from "./images/home-fighter.png";
import { default as HomeHangar } from "./images/home-hangar.png";
import { default as HomeOffice } from "./images/home-office.png";
import { default as HomeStudent } from "./images/home-student.png";
import { default as HomeTower } from "./images/home-tower.png";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

type StyledContainerProps = {
  reverse?: boolean;
  time?: number;
};

const HEIGHT = 320;

const items = [
  HomeFighter,
  HomeOffice,
  HomeTower,
  HomeCessna,
  HomeStudent,
  HomeCockpit,
  HomeHangar,
  HomeEngine,
  HomeAeroplane,
];

const shuffle = getRandomShuffler("some random seed");
const itemsOne = shuffle(items);
const itemsTwo = shuffle(items);
const itemsThree = shuffle(items);

const StyledContainer = styled("div")<StyledContainerProps>`
  display: flex;
  width: ${HEIGHT}px;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  padding-right: ${({ theme }) => theme.spacing(2)};
  flex-direction: column-reverse;
  overflow: hidden;

  & > *:nth-of-type(1) {
    animation: bannerMove ${({ time }) => time}s linear infinite;
    animation-direction: ${({ reverse }) => (reverse ? "reverse" : "normal")};
  }

  @keyframes bannerMove {
    0% {
      margin-bottom: 0px;
    }
    100% {
      margin-bottom: -${9 * HEIGHT}px;
    }
  }

  & .zeroToThirty {
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.15)
    );
  }

  & .thirtyToSixty {
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.5)
    );
  }

  & .sixtyToNinety {
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0.95)
    );
  }
`;

export type CoolSlidingThingProps = {
  animate?: boolean;
} & BoxProps;

export const CoolSlidingThing: FunctionComponent<CoolSlidingThingProps> = ({
  sx,
  ...props
}) => {
  return (
    <Box
      {...props}
      sx={{
        position: "absolute",
        overflow: "hidden",
        width: "100vw",
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: "flex",
        justifyContent: "flex-end",
        ...sx,
      }}
    >
      <StyledContainer time={30}>
        {[...itemsOne, ...itemsOne].map((img, i) => (
          <Image
            key={i + img.src}
            src={img}
            alt=""
            height={HEIGHT}
            className="zeroToThirty"
          />
        ))}
      </StyledContainer>
      <StyledContainer
        reverse
        time={27}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        {[...itemsTwo, ...itemsTwo].map((img, i) => (
          <Image
            key={i + img.src}
            src={img}
            alt=""
            height={HEIGHT}
            className="thirtyToSixty"
          />
        ))}
      </StyledContainer>
      <StyledContainer time={21} sx={{ display: { xs: "none", lg: "flex" } }}>
        {[...itemsThree, ...itemsThree].map((img, i) => (
          <Image
            key={i + img.src}
            src={img}
            alt=""
            height={HEIGHT}
            className="sixtyToNinety"
          />
        ))}
      </StyledContainer>
    </Box>
  );
};
