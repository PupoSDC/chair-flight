import { default as Image } from "next/image";
import { default as NextLink } from "next/link";
import { keyframes } from "@emotion/react";
import { default as CheckIcon } from "@mui/icons-material/CheckOutlined";
import { Box, Card, CardContent, CardCover, Grid, Typography } from "@mui/joy";
import { trpc } from "@cf/trpc/client";
import { container } from "@cf/trpc/client";
import { default as previewAtpl } from "./images/atpl.png";
import { default as previewB737 } from "./images/b737.png";
import { default as previewPrep } from "./images/prep.png";
import type { QuestionBankName } from "@cf/core/question-bank";

const zoomIn = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  numberOfFlashcards: number;
  numberOfAtplQuestions: number;
  numberOfTypeQuestions: number;
};

export const OverviewModules = container<Props, Params, Data>(
  ({ questionBank, sx, component = "section" }) => {
    const params = { questionBank };
    const { numberOfFlashcards, numberOfAtplQuestions, numberOfTypeQuestions } =
      OverviewModules.useData(params);

    const modules = [
      {
        id: "atpl" satisfies QuestionBankName,
        name: "EASA ATPL Theory",
        imgSrc: previewAtpl,
        imgAlt: "A cessna looking cute in the skies",
        tagLine: `${numberOfAtplQuestions} Questions`,
      },
      {
        id: "type" satisfies QuestionBankName,
        name: "737/A320 Type Rating Questions",
        imgSrc: previewB737,
        imgAlt: "737 dragging itself through the skies like an old lady",
        tagLine: `${numberOfTypeQuestions} Questions`,
      },
      {
        id: "prep" satisfies QuestionBankName,
        name: "Interview Preparation",
        imgSrc: previewPrep,
        imgAlt: "F16, almost no one using this website will ever fly.",
        tagLine: `${numberOfFlashcards} Flashcards`,
      },
    ];

    return (
      <Grid container spacing={2} sx={sx} component={component}>
        {modules.map((mod) => {
          const isSelected = mod.id === questionBank;
          return (
            <Grid xs={12} sm={6} lg={3} key={mod.id}>
              <Card
                replace
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
                  <Image
                    src={mod.imgSrc}
                    alt={mod.imgAlt}
                    fill
                    loading="lazy"
                  />
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
  },
);

OverviewModules.displayName = "OverviewModules";

OverviewModules.getData = async ({ helper }) => {
  const router = helper.containers.overviews;
  return await router.getOverviewModules.fetch({});
};

OverviewModules.useData = () => {
  const router = trpc.containers.overviews;
  return router.getOverviewModules.useSuspenseQuery({})[0];
};
