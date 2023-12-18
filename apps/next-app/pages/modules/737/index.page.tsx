import { default as Image } from "next/image";
import {
  Box,
  Card,
  CardContent,
  CardCover,
  Divider,
  Grid,
  Typography,
} from "@mui/joy";
import {
  AppHead,
  LayoutModule737,
  useCurrentRating,
} from "@chair-flight/react/containers";
import type { GetServerSideProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => {
  const [currentRating, setCurrentRating] = useCurrentRating();

  const modules = [
    {
      id: "a320" as const,
      name: "A320 Type Rating Questions",
      imgUrl: "/images/type-ratings/A320.png",
      imgAlt: "A320 Looking super cool doing Airbus stuff",
      numberOfQuestions: 123,
    },
    {
      id: "737" as const,
      name: "737 Type Rating Questions",
      imgUrl: "/images/type-ratings/737.png",
      imgAlt:
        "737 dragging through the skies like the 60+ years old lady she is",
      numberOfQuestions: 456,
    },
  ];

  return (
    <LayoutModule737>
      <AppHead />
      <Grid container spacing={2} maxWidth={"lg"} margin={"auto"}>
        <Grid xs={12}>
          <Typography level="h2">Type Rating Course</Typography>
          <Divider />
        </Grid>
        {modules.map((mod) => {
          const isSelected = mod.id === currentRating;
          return (
            <Grid xs={12} md={6} key={mod.id}>
              <Card
                role="button"
                color={isSelected ? "primary" : "neutral"}
                invertedColors
                onClick={() => setCurrentRating(mod.id)}
                sx={{
                  minHeight: 300,
                  ...(isSelected
                    ? {
                        "& img": {
                          transform: "scale(1.1)",
                        },
                      }
                    : {
                        cursor: "pointer",

                        "&:hover img": {
                          transform: "scale(1.1)",
                          animation: "100ms",
                        },
                      }),
                }}
              >
                <CardCover
                  sx={{
                    objectFit: "cover",
                    overflow: "hidden",
                    background: `
                      linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), 
                      linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                    `,
                  }}
                >
                  <Image src={mod.imgUrl} alt={mod.imgAlt} fill />
                </CardCover>
                <CardContent orientation="horizontal" sx={{ mt: "auto" }}>
                  <Box sx={{ mt: "auto" }}>
                    <Typography level="body-xs" textColor="inherit">
                      {mod.name}
                    </Typography>
                    <Typography
                      fontSize="lg"
                      fontWeight="lg"
                      textColor="inherit"
                    >
                      {mod.numberOfQuestions} Questions
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </LayoutModule737>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default ModuleIndexPage;
