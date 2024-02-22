import { Box, Divider, Link, Stack } from "@mui/joy";
import {
  BugReportButton,
  AppButtonsContainer,
  GithubButton,
  ThemeButton,
} from "@cf/next/user";
import { AppFooter, AppHeader, AppLogo } from "@cf/react/components";
import type { FunctionComponent } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutPublic: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppHeader>
        <AppLogo
          component={Link}
          sx={{ "& h2": { display: { xs: "none", sm: "block" } } }}
          href="/"
        />
        <Box component="nav">
          <Link href="/articles/blog" color="neutral" fontSize="sm">
            Blog
          </Link>
        </Box>
        <AppButtonsContainer>
          <BugReportButton />
          <GithubButton />
          <ThemeButton />
        </AppButtonsContainer>
      </AppHeader>
      {children}
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

export default LayoutPublic;
