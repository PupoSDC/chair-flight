import { ModulesMain } from "@cf/next/ui";
import { UserSettings } from "@cf/next/user";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <ModulesMain fixedHeight>
      <UserSettings />
    </ModulesMain>
  );
};

export default Page;
