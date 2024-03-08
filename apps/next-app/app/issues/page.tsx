import { default as Link } from "next/link";
import { AppHeader, AppLogo, AppMain } from "@cf/next/ui";
import { UserBugReportForm } from "@cf/next/user";

const IssuesPage = () => {
  return (
    <>
      <AppHeader>
        <AppLogo
          component={Link}
          sx={{ "& h2": { display: { xs: "none", sm: "block" } } }}
          href="/"
        />
      </AppHeader>
      <AppMain>
        <UserBugReportForm />
      </AppMain>
    </>
  );
};

export default IssuesPage;
