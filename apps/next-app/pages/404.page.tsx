import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNewOutlined";
import { Link, Button, Stack } from "@mui/joy";
import { Ups } from "@cf/react/web";
import { AppHead } from "./_components/app-head";
import { LayoutPublic } from "./_components/layout-public";
import type { NextPage } from "next";

const PageNotFound: NextPage = () => {
  return (
    <LayoutPublic>
      <AppHead />
      <Ups message="Not found" sx={{ flex: 3 }} />
      <Stack>
        <Button
          component={Link}
          href="/"
          variant="outlined"
          startDecorator={<OpenInNewIcon />}
          children="Go back to the Hangar"
          sx={{ mx: "auto" }}
        />
      </Stack>
    </LayoutPublic>
  );
};

export default PageNotFound;
