import { useState } from "react";
import { Grid, Link, Stack, Typography } from "@mui/joy";
import { trpc } from "@cf/trpc/client";
import { AppHead } from "../_components/app-head";
import {
  AppPublicHeader,
  HEADER_HEIGHT,
} from "../_components/app-public-header";
import { QuestionBankSearch } from "../_containers/question-bank-search";
import type { NextPage } from "next";

type QueryParams = {
  query?: string;
};

type PageParams = QueryParams;

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = () => {
  const [query, setQuery] = useState("");

  trpc.questionBank.search.search.useQuery({
    q: query,
    limit: 10,
    cursor: 0,
  });

  return (
    <>
      <AppHead />
      <AppPublicHeader />
      <Stack
        component="main"
        width="100%"
        mx="auto"
        px={2}
        height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      >
        <Stack sx={{ mt: { xs: 6, md: 24 } }}>
          <Typography
            level="h1"
            sx={{
              textAlign: "center",
              fontSize: { xs: "2.5em", md: "3.5em" },
              "& span": { color: "primary.500" },
            }}
          >
            <span>Chair&nbsp;Flight</span> Question&nbsp;Bank
          </Typography>
          <QuestionBankSearch
            sx={{ width: "100%", maxWidth: "sm", margin: "auto", my: 2 }}
          />
          <Grid
            container
            justifyContent="space-around"
            columnSpacing={1}
            rowSpacing={2}
            sx={{ maxWidth: "sm", margin: "auto" }}
          >
            <Grid
              xs={3}
              sm="auto"
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Link href="/content/questions" fontWeight={500}>
                Questions
              </Link>
            </Grid>
            <Grid
              xs={3}
              sm="auto"
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Link href="/content/docs" fontWeight={500}>
                Docs
              </Link>
            </Grid>
            <Grid
              xs={3}
              sm="auto"
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Link href="/content/annexes" fontWeight={500}>
                Annexes
              </Link>
            </Grid>
            <Grid
              xs={3}
              sm="auto"
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Link href="/content/tests" fontWeight={500}>
                Tests
              </Link>
            </Grid>
            <Grid
              xs={12}
              sm="auto"
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Link href="/content/learning-objectives" fontWeight={500}>
                Learning Objectives
              </Link>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </>
  );
};

export default Page;
