import { type FunctionComponent, type ReactNode } from "react";
import { TestStandAlone } from "@cf/next/tests";

type LayoutProps = {
  meta: ReactNode;
  params: { testId: string };
  searchParams?: { templateId?: string; questionBank?: string };
};

export const Layout: FunctionComponent<LayoutProps> = ({
  meta,
  params: { testId },
}) => {
  return <TestStandAlone testId={testId} meta={meta} />;
};

export default Layout;
