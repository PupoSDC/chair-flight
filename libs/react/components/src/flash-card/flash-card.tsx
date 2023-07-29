import { forwardRef } from "react";
import { Box, Button, Card, Typography, styled } from "@mui/joy";
import { MarkdownClient } from "../markdown-client";
import type { CardProps } from "@mui/joy";

const FlipCard = styled(Card)`
  transition: transform 0.8s;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
`;

export type FlashCardProps = {
  question: string;
  answer: string;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
} & Pick<CardProps, "sx" | "style" | "className">;

export const FlashCard = forwardRef<HTMLDivElement, FlashCardProps>(
  ({ question, answer, flipped = false, onFlip, ...other }, ref) => {
    return (
      <Box
        ref={ref}
        {...other}
        sx={{
          perspective: "1000px",
          position: "relative",
          ...other.sx,
        }}
      >
        <FlipCard
          variant="outlined"
          sx={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {" "}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <Typography level="h2" fontSize="xl" textAlign="center">
              {question}
            </Typography>
          </Box>
          <Button
            variant="solid"
            color="primary"
            aria-label="Explore Bahamas Islands"
            onClick={() => onFlip?.(!flipped)}
          >
            Flip!
          </Button>
        </FlipCard>
        <FlipCard
          variant="outlined"
          sx={{ transform: flipped ? "rotateY(0deg)" : "rotateY(-180deg)" }}
        >
          <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
            {question}
          </Typography>
          <Box sx={{ flex: 1, overflowY: "scroll" }}>
            <MarkdownClient>{answer}</MarkdownClient>
          </Box>
        </FlipCard>
      </Box>
    );
  },
);

FlashCard.displayName = "FlashCard";
