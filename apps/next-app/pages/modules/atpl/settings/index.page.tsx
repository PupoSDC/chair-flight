import { NoSsr } from "@mui/base";
import {
  AppHead,
  LayoutModuleAtpl,
  UserSettings,
} from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

export const EditQuestionPage: NextPage = () => {
  return (
    <LayoutModuleAtpl fixedHeight>
      <AppHead />
      <NoSsr>
        <UserSettings />
      </NoSsr>
    </LayoutModuleAtpl>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default EditQuestionPage;
