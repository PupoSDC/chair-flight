import { default as Image } from "next/image";
import { default as NextLink } from "next/link";
import { keyframes } from "@emotion/react";
import { default as CheckIcon } from "@mui/icons-material/CheckOutlined";
import { Box, Card, CardContent, CardCover, Grid, Typography } from "@mui/joy";
import { trpc } from "@chair-flight/trpc/client";
import { container } from "../../wraper/container";
import { default as previewA320 } from "./images/a320.png";
import { default as previewAtpl } from "./images/atpl.png";
import { default as previewB737 } from "./images/b737.png";
import { default as previewPrep } from "./images/prep.png";
import type { QuestionBankName } from "@chair-flight/base/types";

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
  numberOfB737Questions: number;
  numberOfA320Questions: number;
};

export const OverviewModules = container<Props, Params, Data>(
  ({ questionBank, sx, component = "section" }) => {
    const params = { questionBank };
    const {
      numberOfFlashcards,
      numberOfAtplQuestions,
      numberOfB737Questions,
      numberOfA320Questions,
    } = OverviewModules.useData(params);

    const modules = [
      {
        id: "atpl" as QuestionBankName,
        name: "EASA ATPL Theory",
        imgSrc: previewAtpl,
        imgAlt: "A cessna looking cute in the skies",
        tagLine: `${numberOfAtplQuestions} Questions`,
      },
      {
        id: "a320" as QuestionBankName,
        name: "A320 Type Rating Questions",
        imgSrc: previewA320,
        imgAlt: "A320 Looking super cool doing Airbus stuff",
        tagLine: `${numberOfA320Questions} Questions`,
      },
      {
        id: "b737" as QuestionBankName,
        name: "737 Type Rating Questions",
        imgSrc: previewB737,
        imgAlt: "737 dragging itself through the skies like an old lady",
        tagLine: `${numberOfB737Questions} Questions`,
      },
      {
        id: "prep" as QuestionBankName,
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
  const [
    { count: numberOfFlashcards },
    { count: numberOfAtplQuestions },
    { count: numberOfB737Questions },
    { count: numberOfA320Questions },
  ] = await Promise.all([
    helper.questionBank.getNumberOfFlashcards.fetch({ questionBank: "prep" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "atpl" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "b737" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "a320" }),
  ]);

  return {
    numberOfFlashcards,
    numberOfAtplQuestions,
    numberOfB737Questions,
    numberOfA320Questions,
  };
};

OverviewModules.useData = () => {
  const qb = trpc.questionBank;
  const [
    [{ count: numberOfFlashcards }],
    [{ count: numberOfAtplQuestions }],
    [{ count: numberOfB737Questions }],
    [{ count: numberOfA320Questions }],
  ] = [
    qb.getNumberOfFlashcards.useSuspenseQuery({ questionBank: "prep" }),
    qb.getNumberOfQuestions.useSuspenseQuery({ questionBank: "atpl" }),
    qb.getNumberOfQuestions.useSuspenseQuery({ questionBank: "b737" }),
    qb.getNumberOfQuestions.useSuspenseQuery({ questionBank: "a320" }),
  ];
  return {
    numberOfFlashcards,
    numberOfAtplQuestions,
    numberOfB737Questions,
    numberOfA320Questions,
  };
};
