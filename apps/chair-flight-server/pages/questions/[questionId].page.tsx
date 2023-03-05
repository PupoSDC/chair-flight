import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

const QuestionPage: NextPage = () => {
  return <></>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};

export default QuestionPage;
