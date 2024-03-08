import { TestReview } from "@cf/next/tests";
import { AppMain } from "@cf/next/ui";
import type { FunctionComponent } from "react";

type Props = {
  params: {
    testId: string;
  };
};

const Page: FunctionComponent<Props> = ({ params }) => {
  const { testId } = params;

  return (
    <AppMain sx={{ p: 0 }}>
      <TestReview testId={testId} />
    </AppMain>
  );
};

export default Page;
