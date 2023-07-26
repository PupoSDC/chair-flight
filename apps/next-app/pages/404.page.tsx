import { Link, Typography } from "@mui/joy";
import { Header, AppLayout, Ups } from "@chair-flight/react/components";
import { AppHead } from "@chair-flight/react/containers";
import type { NextPage } from "next";

const PageNotFound: NextPage = () => {
  return (
    <>
      <AppHead />
      <Header />
      <AppLayout.Main>
        <Ups message="Not found" sx={{ flex: 3 }} />
        <Typography sx={{ margin: "auto", flex: 1 }}>
          <Link href="/">Go back to the Hangar</Link>
        </Typography>
      </AppLayout.Main>
    </>
  );
};

export default PageNotFound;
