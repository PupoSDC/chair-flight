import { forwardRef } from "react";
import { Box, Button, Card, Typography, styled } from "@mui/joy";
import type { CardProps } from "@mui/joy";
import type { ReactNode } from "react";

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

export type FlashcardProps = {
  question: ReactNode;
  answer: ReactNode;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
} & Pick<CardProps, "sx" | "style" | "className">;

export const Flashcard = forwardRef<HTMLDivElement, FlashcardProps>(
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
          <Box sx={{ flex: 1, overflowY: "scroll" }}>{answer}</Box>
        </FlipCard>
      </Box>
    );
  },
);

Flashcard.displayName = "Flashcard";
