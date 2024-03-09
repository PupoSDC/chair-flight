import { Box, Link, Stack, Typography } from "@mui/joy";
import {
  BugReportButton,
  AppButtonsContainer,
  GithubButton,
  ThemeButton,
  AppMain,
} from "@cf/next/ui";
import { AppFooter, AppHeader, AppLogo } from "@cf/next/ui";
import type { FunctionComponent, ReactNode } from "react";

type LayoutProps = {
  popularPages: ReactNode;
  dailyUsers: ReactNode;
};

const Layout: FunctionComponent<LayoutProps> = ({
  popularPages,
  dailyUsers,
}) => {
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
      <AppMain>
        <Typography level="h3" sx={{ mt: 3 }}>
          Daily Users
        </Typography>

        {dailyUsers}

        <Typography level="h3" sx={{ mt: 2 }}>
          Most popular pages (last 7 days)
        </Typography>

        {popularPages}
      </AppMain>
      <AppFooter>
        <Stack gap={1}>
          <Link href={"/blog"} level="body-sm">
            Github
          </Link>
          <Link href={"/blog"} level="body-sm">
            Blog
          </Link>
          <Link href={"/about-us"} level="body-sm">
            About Chair Flight
          </Link>
        </Stack>
      </AppFooter>
    </>
  );
};

export default Layout;
