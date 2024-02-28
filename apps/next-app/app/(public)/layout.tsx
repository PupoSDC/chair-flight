import { Box, Link, Stack } from "@mui/joy";
import {
  BugReportButton,
  AppButtonsContainer,
  GithubButton,
  ThemeButton,
} from "@cf/next/ui";
import { AppFooter, AppHeader, AppLogo } from "@cf/next/ui";
import type { FunctionComponent, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
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
