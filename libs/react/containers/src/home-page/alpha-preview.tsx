import { Typography, Button, Link, Grid, Box } from "@mui/joy";
import type { FunctionComponent } from "react";

const buttonLayout = {
  xs: 12,
  sm: 6,
};

export const AlphaPreview: FunctionComponent = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
      maxWidth: (t) => t.breakpoints.values.md,
      margin: "auto",
    }}
  >
    <Typography level="h2" sx={{ textAlign: "center", mb: 4 }}>
      Explore the Alpha functionalities
    </Typography>
    <Grid
      spacing={{ xs: 2, sm: 4 }}
      pl={{ xs: 2, sm: 4 }}
      container
      sx={{
        width: "100%",
        maxWidth: (t) => t.breakpoints.values.md,
      }}
    >
      <Grid {...buttonLayout}>
        <Button variant="outlined" component={Link} href="/questions" fullWidth>
          Search Questions
        </Button>
      </Grid>
      <Grid {...buttonLayout}>
        <Button variant="outlined" component={Link} href="/tests/new" fullWidth>
          Create a Test
        </Button>
      </Grid>
      <Grid {...buttonLayout}>
        <Button
          sx={{ textAlign: "center" }}
          variant="outlined"
          component={Link}
          href="/learning-objectives"
          fullWidth
        >
          Search Learning Objectives
        </Button>
      </Grid>
      <Grid {...buttonLayout}>
        <Button
          sx={{ textAlign: "center" }}
          variant="outlined"
          component={Link}
          href="/flashcards"
          fullWidth
        >
          Flash Cards
        </Button>
      </Grid>
    </Grid>
  </Box>
);
