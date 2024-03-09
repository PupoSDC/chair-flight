import { Sheet } from "@mui/joy";
import { Analytics } from "@cf/providers/analytics";
import { Client } from "./client";
import type { FunctionComponent } from "react";

const Page: FunctionComponent = async () => {
  const analytics = new Analytics();
  const { pagesUsed } = await analytics.getPagesUsed();

  return (
    <Sheet sx={{ width: "100%", height: 400, p: 2 }}>
      <Client pagesUsed={pagesUsed} />
    </Sheet>
  );
};

export default Page;
