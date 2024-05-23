import { LayoutPublic } from "../../_components/layout-public";
import type { NextPage } from "next";

type QueryParams = {};

type PageParams = QueryParams & {};

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = ({}) => {
  return <LayoutPublic>{null}</LayoutPublic>;
};

export default Page;
