"use client";

import { Button, Grid, Link, Stack, Typography } from "@mui/joy";
import { CountUp } from "@cf/react/components";
import { usePreviewContainer } from "./preview-container";
import type { FunctionComponent } from "react";

export const PreviewAtpl: FunctionComponent<{
  numberOfQuestions: number;
}> = ({ numberOfQuestions }) => {
  const { questionBank, containerRef } = usePreviewContainer("atpl");
  if (questionBank !== "atpl") return null;

  return (
    <Stack ref={containerRef}>
      <Typography
        level="h3"
        component="h2"
        sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
      >
        {`Explore `}
        <CountUp
          component={"span"}
          end={numberOfQuestions}
          duration={2000}
          sx={{
            color: "primary.500",
            width: "3.2em",
            display: "inline-flex",
            justifyContent: "flex-end",
          }}
        />
        {` questions`}
        <br />
        {`In infinite combinations`}
      </Typography>
      <Typography level="h4" component="p" sx={{ mt: 2 }}>
        Chair Flight&apos;s questions are organized into variants, enabling you
        to practice challenging questions repeatedly and promptly skip variants
        of questions you already comprehend.
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ pt: 2 }}>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Explore Learning Objectives"}
            href="/modules/atpl/learning-objectives"
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Explore Questions"}
            href="/modules/atpl/questions"
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Create a Test"}
            href="/modules/atpl/tests/create"
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Read Articles"}
            href="/modules/atpl/docs"
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
