import { AppHead, LayoutModule737 } from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => (
  <LayoutModule737>
    <AppHead />
  </LayoutModule737>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      statusCode: 303,
      destination: "/modules/737/tests",
    },
  };
};

export default ModuleIndexPage;
