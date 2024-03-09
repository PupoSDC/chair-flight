import { Sheet } from "@mui/joy";
import { Analytics } from "@cf/providers/analytics";
import { Client } from "./client";
import type { FunctionComponent } from "react";

const Page: FunctionComponent = async () => {
  const analytics = new Analytics();
  const { dailyUsers } = await analytics.getDailyUsers();

  return (
    <Sheet sx={{ width: "100%", height: 400, p: 2 }}>
      <Client dailyUsers={dailyUsers} />
    </Sheet>
  );
};

export default Page;
