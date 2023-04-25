import type { FunctionComponent } from "react";
import { Typography, Button, Link, Grid, Box } from "@mui/joy";

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
      <Grid xs={12} sm={4}>
        <Button variant="outlined" component={Link} href="/questions" fullWidth>
          Search Questions
        </Button>
      </Grid>
      <Grid xs={12} sm={4}>
        <Button variant="outlined" component={Link} href="/tests" fullWidth>
          Create a Test
        </Button>
      </Grid>
      <Grid xs={12} sm={4}>
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
    </Grid>
  </Box>
);
