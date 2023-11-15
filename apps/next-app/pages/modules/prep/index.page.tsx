import type { GetServerSideProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => <></>;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    statusCode: 303,
    destination: "/modules/737/tests",
  },
});

export default ModuleIndexPage;
