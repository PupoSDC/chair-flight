import { Box, Button, Link, Typography } from "@mui/joy";
import { Typical } from "@chair-flight/react/components";
import { CoolSlidingThing } from "./cool-sliding-thing";
import type { FunctionComponent } from "react";

const PUNCH_LINES = [
  "Community Built",
  2000,
  "Minimalistic",
  2000,
  "Free",
  2000,
];

export const LandingScreen: FunctionComponent = () => {
  return (
    <>
      <Box
        sx={{
          m: "auto",
          p: 2,
          height: "100%",
          width: "100%",
          maxWidth: "950px",
          display: "flex",
          zIndex: 10,
          flexDirection: { xs: "column-reverse", md: "row" },
        }}
      >
        <Box
          sx={{
            height: "100%",
            my: "auto",
            display: "flex",
            flexDirection: "column",
            maxHeight: {
              xs: "100%",
              md: "240px",
            },
            width: {
              xs: "100%",
              md: "50%",
            },
          }}
        >
          <Typography
            level="h3"
            component="h1"
            sx={{ fontWeight: 900, fontSize: { md: "3em" } }}
          >
            Chair Flight is <br />
            <Typical sx={{ color: "primary.500" }} steps={PUNCH_LINES} />
            &nbsp;
          </Typography>
          <Typography level="h4" component="h2">
            Built by students for students.
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <Button
              sx={{ my: 1, mr: { md: 2 } }}
              fullWidth
              size="lg"
              component={Link}
              href="/questions"
              children="Explore Questions"
            />
            <Button
              sx={{ my: 1 }}
              fullWidth
              size="lg"
              variant="outlined"
              component={Link}
              href="/articles/about-us"
              children="About This Project"
            />
          </Box>
        </Box>
      </Box>
      <CoolSlidingThing />
    </>
  );
};
