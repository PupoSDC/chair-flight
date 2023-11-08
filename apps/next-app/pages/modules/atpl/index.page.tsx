import { AppHead, LayoutModuleAtpl } from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => (
  <LayoutModuleAtpl>
    <AppHead />
  </LayoutModuleAtpl>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      statusCode: 303,
      destination: "/modules/atpl/tests",
    },
  };
};

export default ModuleIndexPage;
