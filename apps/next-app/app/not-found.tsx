import { Link, Stack, Box } from "@mui/joy";
import {
  AppButtonsContainer,
  AppHeader,
  AppLogo,
  BugReportButton,
  GithubButton,
  ThemeButton,
  UpsNotFound,
} from "@cf/next/ui";
import type { NextPage } from "next";

const PageNotFound: NextPage = () => {
  return (
    <>
      <AppHeader>
        <AppLogo
          component={Link}
          sx={{ "& h2": { display: { xs: "none", sm: "block" } } }}
          href="/"
        />
        <Box component="nav" sx={{ ml: 2, display: "flex" }}>
          <Link href="/blog" color="neutral" fontSize="sm">
            Blog
          </Link>
        </Box>
        <AppButtonsContainer>
          <BugReportButton />
          <GithubButton />
          <ThemeButton />
        </AppButtonsContainer>
      </AppHeader>
      <Stack component="main" justifyContent={"center"} flex={1}>
        <UpsNotFound />
      </Stack>
    </>
  );
};

export default PageNotFound;
