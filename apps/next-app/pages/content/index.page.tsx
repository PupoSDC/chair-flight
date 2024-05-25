import { Grid, Link, Stack, Typography } from "@mui/joy";
import { AppLogo, SearchQuery } from "@cf/react/web";
import { LayoutPublic } from "../_components/layout-public";
import type { NextPage } from "next";
import { NOOP } from "@cf/base/utils";

type QueryParams = {
  query?: string;
};

type PageParams = QueryParams;

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = () => {
  return (
    <LayoutPublic fixedHeight>
      <Stack alignItems={"center"} textAlign={"center"} sx={{ mt: 6 }}>
        <AppLogo
          color="primary"
          sx={{
            width: { xs: 64, md: 108, lg: 124 },
            height: { xs: 64, md: 108, lg: 124 },
            my: 2,
          }}
        />
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
        <SearchQuery
          value=""
          sx={{ width: "100%", maxWidth: "sm", margin: "auto", my: 2 }}
          onChange={NOOP}
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
    </LayoutPublic>
  );
};

export default Page;
