"use client";

import { Button, Grid, Link, Stack, Typography } from "@mui/joy";
import { CountUp } from "@cf/react/components";
import { usePreviewContainer } from "./preview-container";
import type { FunctionComponent } from "react";

export const PreviewType: FunctionComponent<{
  numberOfQuestions: number;
}> = ({ numberOfQuestions }) => {
  const { questionBank, containerRef } = usePreviewContainer("type");
  if (questionBank !== "type") return null;

  return (
    <Stack ref={containerRef}>
      <Typography
        level="h3"
        component="h2"
        sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
      >
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
        {` Type Rating`}
        <br />
        {`Questions`}
      </Typography>
      <Typography level="h4" component="p" sx={{ mt: 2 }}>
        Review the most commonly asked tech knowledge questions for the 2 most
        popular aircraft in the world: the Airbus A320 and Boeing 737
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ pt: 2 }}>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Explore Learning Objectives"}
            href="/modules/type/learning-objectives"
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Explore Questions"}
            href="/modules/type/questions"
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            size="lg"
            component={Link}
            children={"Create a Test"}
            href="/modules/type/tests/create"
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Button
            fullWidth
            disabled
            size="lg"
            component={Link}
            children={"Read Articles"}
            href="/modules/type/docs"
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
