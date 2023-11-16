import type { GetServerSideProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => <></>;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    statusCode: 303,
    destination: "/modules/prep/flashcards",
  },
});

export default ModuleIndexPage;
