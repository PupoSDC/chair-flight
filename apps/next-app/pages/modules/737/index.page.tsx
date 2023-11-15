import { AppHead, LayoutModule737 } from "@chair-flight/react/containers";
import type { GetServerSideProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => (
  <LayoutModule737>
    <AppHead />
  </LayoutModule737>
);

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    statusCode: 303,
    destination: "/modules/737/tests",
  },
});

export default ModuleIndexPage;
