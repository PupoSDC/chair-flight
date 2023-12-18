import { NoSsr } from "@mui/base";
import {
  AppHead,
  LayoutModulePrep,
  UserSettings,
} from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

const SettingsPage: NextPage = () => (
  <LayoutModulePrep fixedHeight>
    <AppHead />
    <NoSsr>
      <UserSettings />
    </NoSsr>
  </LayoutModulePrep>
);

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default SettingsPage;
