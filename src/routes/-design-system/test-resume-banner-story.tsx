import { TestResumeBanner } from "../../libs/ui/components/tests/test-resume-banner";
import { STORY_TEST_IN_PROGRESS } from "./fixtures";
import type { FC } from "react";

export const TestResumeBannerStory: FC = () => (
  <TestResumeBanner test={STORY_TEST_IN_PROGRESS} />
);
