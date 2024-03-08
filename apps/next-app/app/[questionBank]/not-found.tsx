import { ModulesMain, UpsNotFound } from "@cf/next/ui";
import type { FunctionComponent } from "react";

const NotFound: FunctionComponent = () => (
  <ModulesMain fixedHeight>
    <UpsNotFound />
  </ModulesMain>
);

export default NotFound;
