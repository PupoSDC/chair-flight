import { default as Image } from "next/image";
import { default as NextLink } from "next/link";
import { keyframes } from "@emotion/react";
import { default as CheckIcon } from "@mui/icons-material/CheckOutlined";
import { Box, Card, CardContent, CardCover, Grid, Typography } from "@mui/joy";
import { trpc } from "@chair-flight/trpc/client";
import type { ModuleName } from "@chair-flight/base/types";
import type { GridProps } from "@mui/joy";
import type { FC } from "react";

const useNumberOfQuestions =
  trpc.questionBank.getNumberOfQuestions.useSuspenseQuery;

const zoomIn = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

export type ModulesOverviewProps = {
  module: ModuleName;
} & GridProps;

export const ModulesOverview: FC<ModulesOverviewProps> = ({
  module,
  container = true,
  spacing = 2,
  ...gridProps
}) => {
  const [questionsAtpl] = useNumberOfQuestions({ questionBank: "atpl" });
  const [questions737] = useNumberOfQuestions({ questionBank: "737" });
  const [questionsA320] = useNumberOfQuestions({ questionBank: "a320" });

  const modules = [
    {
      id: "atpl" as ModuleName,
      name: "EASA ATPL Theory",
      imgUrl: "/images/modules/atpl.png",
      imgAlt: "A320 Looking super cool doing Airbus stuff",
      tagLine: `${questionsAtpl.count} Questions`,
    },
    {
      id: "a320" as ModuleName,
      name: "A320 Type Rating Questions",
      imgUrl: "/images/modules/A320.png",
      imgAlt: "A320 Looking super cool doing Airbus stuff",
      tagLine: `${questionsA320.count} Questions`,
    },
    {
      id: "737" as ModuleName,
      name: "737 Type Rating Questions",
      imgUrl: "/images/modules/737.png",
      imgAlt: "737 dragging itself through the skies like an old lady",
      tagLine: `${questions737.count} Questions`,
    },
    {
      id: "prep" as ModuleName,
      name: "Interview Preparation",
      imgUrl: "/images/modules/prep.png",
      imgAlt: "F16, almost no one using this website will ever fly.",
      tagLine: `Flashcards and more!`,
    },
  ];

  return (
    <Grid container={container} spacing={spacing} {...gridProps}>
      {modules.map((mod) => {
        const isSelected = mod.id === module;
        return (
          <Grid xs={12} sm={6} lg={3} key={mod.id}>
            <Card
              component={NextLink}
              role="button"
              href={`/modules/${mod.id}`}
              color={isSelected ? "primary" : "neutral"}
              sx={{
                height: { xs: 120, sm: 200 },
                textDecoration: "none",
                ...(isSelected
                  ? {
                      "& img": {
                        transform: "scale(1.1)",
                      },
                    }
                  : {
                      cursor: "pointer",

                      "&:hover img": {
                        animation: `${zoomIn} 100ms ease forwards`,
                      },
                    }),
              }}
            >
              <CardCover sx={{ objectFit: "cover", overflow: "hidden" }}>
                <Image src={mod.imgUrl} alt={mod.imgAlt} fill loading="lazy" />
              </CardCover>
              <CardCover
                sx={{
                  background: `
                    linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 200px), 
                    linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 300px)
                  `,
                }}
              />
              <CardContent orientation="horizontal" sx={{ mt: "auto" }}>
                <Box sx={{ mt: "auto" }}>
                  <Typography
                    level="body-xs"
                    textColor={isSelected ? "primary.200" : "neutral.200"}
                  >
                    {mod.name}
                  </Typography>
                  <Typography
                    fontSize="lg"
                    fontWeight="lg"
                    textColor={
                      isSelected
                        ? "primary.plainColor"
                        : "primary.plainDisabledColor"
                    }
                  >
                    {mod.tagLine}
                  </Typography>
                </Box>
                {isSelected && (
                  <CheckIcon
                    sx={{
                      ml: "auto",
                      color: (t) => t.palette.primary.solidColor,
                      bgcolor: (t) => t.palette.primary.solidBg,
                      borderRadius: "50%",
                    }}
                    size="lg"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
