import { default as Image } from "next/image";
import { default as NextLink } from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardCover,
  Divider,
  Grid,
  Typography,
} from "@mui/joy";
import type { QuestionBankName } from "@chair-flight/base/types";
import { AppHead, LayoutModuleBank } from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type QuestionBankIndexPageProps = {
  questionBank: QuestionBankName;
  numberOfAtplQuestions: number;
  numberOf737Questions: number;
  numberOfA320Questions: number;
};

type QuestionBankIndexPageParams = {
  questionBank: QuestionBankName;
};

const QuestionBankIndexPage: NextPage<QuestionBankIndexPageProps> = ({
  questionBank,
  numberOfAtplQuestions,
  numberOf737Questions,
  numberOfA320Questions,
}) => {
  const modules = [
    {
      id: "atpl" as QuestionBankName,
      name: "EASA ATPL Theory",
      imgUrl: "/images/type-ratings/A320.png",
      imgAlt: "A320 Looking super cool doing Airbus stuff",
      numberOfQuestions: numberOfAtplQuestions,
    },
    {
      id: "a320" as QuestionBankName,
      name: "A320 Type Rating Questions",
      imgUrl: "/images/type-ratings/A320.png",
      imgAlt: "A320 Looking super cool doing Airbus stuff",
      numberOfQuestions: numberOfA320Questions,
    },
    {
      id: "737" as QuestionBankName,
      name: "737 Type Rating Questions",
      imgUrl: "/images/type-ratings/737.png",
      imgAlt: "737 dragging itself through the skies like an old lady",
      numberOfQuestions: numberOf737Questions,
    },
  ];

  return (
    <LayoutModuleBank questionBank={questionBank}>
      <AppHead />
      <Grid container spacing={2} maxWidth={"lg"} margin={"auto"}>
        <Grid xs={12}>
          <Typography level="h2">Current Question Bank</Typography>
          <Divider />
        </Grid>
        {modules.map((mod) => {
          const isSelected = mod.id === questionBank;
          return (
            <Grid xs={12} md={6} lg={4} key={mod.id}>
              <Card
                component={NextLink}
                role="button"
                href={`/modules/${mod.id}`}
                color={isSelected ? "primary" : "neutral"}
                sx={{
                  minHeight: 200,
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
                      textColor={
                        isSelected
                          ? "primary.plainColor"
                          : "primary.plainDisabledColor"
                      }
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
    </LayoutModuleBank>
  );
};

export const getStaticProps: GetStaticProps<
  QuestionBankIndexPageProps,
  QuestionBankIndexPageParams
> = async ({ params }) => {
  if (!params) throw new Error("Params must be defined. Check File name!");
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();
  const { questionBank } = params!;
  const [
    { count: numberOfAtplQuestions },
    { count: numberOf737Questions },
    { count: numberOfA320Questions },
  ] = await Promise.all([
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "atpl" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "a320" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "737" }),
  ]);

  return {
    props: {
      questionBank,
      numberOfAtplQuestions,
      numberOf737Questions,
      numberOfA320Questions,
    },
  };
};

export const getStaticPaths: GetStaticPaths<
  QuestionBankIndexPageParams
> = async () => {
  const banks: QuestionBankName[] = ["737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default QuestionBankIndexPage;
