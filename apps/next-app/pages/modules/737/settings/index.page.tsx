import { NoSsr } from "@mui/base";
import {
  AppHead,
  LayoutModule737,
  UserSettings,
} from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

export const EditQuestionPage: NextPage = () => {
  return (
    <LayoutModule737 fixedHeight>
      <AppHead />
      <NoSsr>
        <UserSettings />
      </NoSsr>
    </LayoutModule737>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default EditQuestionPage;
