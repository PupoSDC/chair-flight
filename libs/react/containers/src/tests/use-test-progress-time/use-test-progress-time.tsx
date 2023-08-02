import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTestProgress } from "../use-test-progress";

/**
 * This hook has 3 side effects:
 * 1) It starts the test if it's not started yet
 * 2) It navigates away from the test once it's finished
 * 3) It ticks the test timer every second
 */
export const useTestProgressTime = ({ testId }: { testId: string }) => {
  const router = useRouter();
  const getTest = useTestProgress((s) => s.getTest);
  const startTest = useTestProgress((s) => s.startTest);
  const tickTestTimer = useTestProgress((s) => s.tickTestTimer);

  useEffect(() => {
    const test = getTest({ testId });
    if (test.status === "finished") {
      router.push(`/tests/${test.id}/review`, undefined, { shallow: true });
    }
    if (test.status === "created") {
      startTest({ testId: test.id });
    }
  }, [router, testId, getTest, startTest]);

  useEffect(() => {
    const test = getTest({ testId });
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpentInMs = currentTime - lastTime;
      lastTime = currentTime;
      tickTestTimer({ testId: test.id, timeSpentInMs });
    }, 1000);
    return () => clearInterval(interval);
  }, [testId, getTest, tickTestTimer]);
};
