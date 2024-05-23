import type { NextPage } from "next";
import { LayoutPublic } from "../../_components/layout-public";

type QueryParams = {};

type PageParams = QueryParams & {};

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = ({}) => {
  return <LayoutPublic>{null}</LayoutPublic>;
};

export default Page;
