import type { GetStaticProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => <></>;

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      statusCode: 303,
      destination: "/modules/prep/flashcards",
    },
  };
};

export default ModuleIndexPage;
