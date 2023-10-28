import { forwardRef, useRef, useState } from "react";
import { default as ArrowBackIosNewIcon } from "@mui/icons-material/ArrowBackIosNew";
import { default as ArrowForwardIosIcon } from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, LinearProgress, styled } from "@mui/joy";
import { GlobalStyles } from "@mui/material";
import type { BoxProps } from "@mui/joy";
import type { ReactElement } from "react";

const CARD_WIDTH = 420;

const WrapperContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  scrollbar-width: none;
`;

const ControlsContainer = styled(Box)`
  --IconButton-size: 40px;
  --IconButton-radius: 30px;
  --ControlBox-size: 152px;

  width: var(--ControlBox-size);
  padding: ${({ theme }) => theme.spacing(1, 0, 2, 0)};
  display: flex;
  justify-content: space-between;
  margin: auto;

  ${({ theme }) => theme.breakpoints.up("md")} {
    --IconButton-size: 60px;
    padding: ${({ theme }) => theme.spacing(2, 0)};
  }
`;

const CardsContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 500px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding-right: calc(50vw - ${CARD_WIDTH / 2}px);
  }
`;

const FlashcardTinderCardWrapper = styled(Box)`
  flex: 0 0 100vw;
  width: 100%;
  height: 100%;
  max-width: ${CARD_WIDTH}px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing(2)};
  position: relative;
  scroll-snap-align: start;

  &:last-of-type {
    margin-right: calc(50vw - ${CARD_WIDTH / 2}px);
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    & > * {
      transform: translate(calc(50vw - ${CARD_WIDTH / 2}px), 0);
    }
  }
`;

export type FlashcardTinderProps = {
  children: ReactElement[];
} & Pick<BoxProps, "sx" | "style" | "className">;

/**
 * A swipable container designed to flash cards, and inspired by Tinder.
 *
 * Children must be an array.
 */
export const FlashcardTinder = forwardRef<HTMLDivElement, FlashcardTinderProps>(
  ({ children, ...boxProps }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentScroll, setCurrentScroll] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollPercent = scrollLeft / maxScroll;

      setCurrentScroll(scrollPercent);
    };

    const scrollProgrammatically = (direction: "left" | "right") => {
      const container = containerRef.current;
      if (!container) return;
      containerRef.current?.scrollBy({
        left: (direction === "left" ? -1 : 1) * CARD_WIDTH,
        behavior: "smooth",
      });
    };

    return (
      <WrapperContainer {...boxProps} ref={ref}>
        <GlobalStyles
          styles={{
            body: {
              "overscroll-behavior-y": "none",
              "overscroll-behavior-x": "none",
            },
          }}
        />
        <CardsContainer ref={containerRef} onScroll={handleScroll}>
          {children.map((child) => (
            <FlashcardTinderCardWrapper key={child.key}>
              {child}
            </FlashcardTinderCardWrapper>
          ))}
        </CardsContainer>
        <ControlsContainer>
          <IconButton
            disabled={currentScroll === 0}
            variant="solid"
            onClick={() => scrollProgrammatically("left")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            disabled={currentScroll === 1}
            variant="solid"
            onClick={() => scrollProgrammatically("right")}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </ControlsContainer>
        <LinearProgress
          value={currentScroll * 100}
          determinate
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            "--LinearProgress-radius": 0,
          }}
        />
      </WrapperContainer>
    );
  },
);

FlashcardTinder.displayName = "FlashcardTinder";
