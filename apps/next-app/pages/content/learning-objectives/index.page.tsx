import { Stack } from "@mui/joy";
import { AppHead } from "../../_components/app-head";
import { AppPublicFooter } from "../../_components/app-public-footer";
import {
  AppPublicHeader,
  HEADER_HEIGHT,
} from "../../_components/app-public-header";
import type { NextPage } from "next";

type QueryParams = {
  tab?: string;
};

type PageParams = QueryParams & {
  learningObjectiveId: string;
};

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = () => {
  return (
    <>
      <AppHead />
      <AppPublicHeader />
      <Stack
        component="main"
        width="100%"
        mx="auto"
        px={2}
        height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      ></Stack>
      <AppPublicFooter />
    </>
  );
};

export default Page;
