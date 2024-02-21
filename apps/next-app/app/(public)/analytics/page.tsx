import { Stack } from "@mui/joy";
import { default as GlobalStyles } from "@mui/joy/GlobalStyles";
import { default as Sheet } from "@mui/joy/Sheet";
import { default as Typography } from "@mui/joy/Typography";
import { Analytics } from "@cf/providers/analytics";
import { DailyUsersChart } from "./components/daily-users-chart";
import { PagesUsedChart } from "./components/pages-used-chart";
import type { FunctionComponent } from "react";

const getData = async () => {
  const analytics = new Analytics();
  const { dailyUsers } = await analytics.getDailyUsers();
  const { pagesUsed } = await analytics.getPagesUsed();
  return {
    dailyUsers,
    pagesUsed,
  };
};

const AnalyticsPage: FunctionComponent = async () => {
  const { dailyUsers, pagesUsed } = await getData();

  return (
    <Stack
      component="main"
      sx={{ width: "100%", maxWidth: "lg", mx: "auto", py: 2 }}
    >
      <GlobalStyles
        styles={{
          ".MuiChartsTooltip-table": {
            backgroundColor: "background.surface",
          },
        }}
      />
      <Typography level="h1">Analytics</Typography>

      <Typography level="h3" sx={{ mt: 3 }}>
        Daily Users
      </Typography>
      <Sheet sx={{ width: "100%", height: 350, p: 2, mt: 1 }}>
        <DailyUsersChart dailyUsers={dailyUsers} />
      </Sheet>
      <Typography level="h3" sx={{ mt: 2 }}>
        Most popular pages (last 7 days)
      </Typography>

      <Sheet sx={{ width: "100%", height: 350, p: 2, mt: 1 }}>
        <PagesUsedChart pagesUsed={pagesUsed} />
      </Sheet>
    </Stack>
  );
};

export default AnalyticsPage;
