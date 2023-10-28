import { useEffect, useState } from "react";
import { default as RenderIfVisible } from "react-render-if-visible";
import { Box, Button, Link, Typography } from "@mui/joy";
import {
  HEADER_HEIGHT,
  CountUp,
  Flashcard,
} from "@chair-flight/react/components";
import type { FlashcardContent } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export type FlashcardPreviewProps = {
  numberOfFlashcards: number;
  flashcard: FlashcardContent;
};

export const FlashcardPreview: FunctionComponent<FlashcardPreviewProps> = ({
  numberOfFlashcards,
  flashcard,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsFlipped(false), 10000);
  }, [isFlipped]);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row-reverse" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          height: {
            xs: "100%",
            md: `calc(100vh - ${HEADER_HEIGHT}px)`,
          },
          pr: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Typography level="h2" sx={{ fontWeight: 900 }}>
          {`Prepare your next interview using `}
          <RenderIfVisible
            visibleOffset={0}
            defaultHeight={20}
            placeholderElement="span"
            rootElement={"span"}
            stayRendered
          >
            <CountUp
              component={"b"}
              end={numberOfFlashcards}
              duration={2000}
              sx={{
                color: "primary.500",
                width: "2em",
                display: "inline-flex",
                justifyContent: "flex-end",
              }}
            />
          </RenderIfVisible>
          {` flash cards`}
        </Typography>
        <Typography level="h4" component="p" sx={{ mt: 2 }}>
          When you get to your first job interview, you won't have the benefit
          of being able to select the best out of 4 answers. You will have to
          explain the topics you have learned in the theory classes without any
          crutches. <br />
          Use our flash cards to practice answering open ended questions and
          secure your first job.
        </Typography>
        <Button
          sx={{
            mt: 2,
            mx: { xs: "auto", md: "initial" },
          }}
          size="lg"
          component={Link}
          variant="outlined"
          children={"Explore Flash Cards"}
          href="/flashcards"
        />
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: { xs: "none", sm: "flex" },
          pr: 2,
          mb: 2,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Flashcard
          {...flashcard}
          sx={{ width: 400, height: 400 }}
          flipped={isFlipped}
          onFlip={(f) => setIsFlipped(f)}
        />
      </Box>
    </Box>
  );
};
