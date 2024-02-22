"use client";

import { Button, Link, Stack, Typography } from "@mui/joy";
import { CountUp } from "@cf/react/components";
import { usePreviewContainer } from "./preview-container";
import type { FunctionComponent } from "react";

export const PreviewPrep: FunctionComponent<{
  numberOfQuestions: number;
}> = ({ numberOfQuestions }) => {
  const { questionBank, containerRef } = usePreviewContainer("prep");
  if (questionBank !== "prep") return null;

  return (
    <Stack ref={containerRef}>
      <Typography
        level="h3"
        component="h2"
        sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
      >
        {`Prepare your next interview with `}
        <CountUp
          component={"span"}
          end={numberOfQuestions}
          duration={2000}
          sx={{
            color: "primary.500",
            width: "1.8em",
            display: "inline-flex",
            justifyContent: "flex-end",
          }}
        />
        {` flashcards`}
      </Typography>
      <Typography level="h4" component="p" sx={{ mt: 2 }}>
        When you get to your first job interview, you won&apos;t have the
        benefit of being able to select the best out of 4 answers. You will have
        to explain the topics you have learned in the theory classes without any
        crutches. <br />
        Use our flash cards to practice answering open ended questions and
        secure your first job.
      </Typography>
      <Button
        fullWidth
        size="lg"
        component={Link}
        children={"Explore Flash Cards"}
        href="/modules/prep/flashcards"
        sx={{ my: 2 }}
      />
    </Stack>
  );
};
