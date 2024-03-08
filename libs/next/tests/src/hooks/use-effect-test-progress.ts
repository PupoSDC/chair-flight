"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTestProgress } from "./use-test-progress";

/**
 * Handles all the side effects of the time passing during a test
 * 1) It starts the test if it's not started yet
 * 2) It navigates away from the test once it's finished
 * 3) It ticks the test timer every second
 * 4) Update search params with template Id during study sessions
 */
export const useEffectTestProgress = (args: { testId: string }) => {
  const router = useRouter();
  const test = useTestProgress((s) => s.getTest(args));
  const question = useTestProgress((s) => s.getCurrentQuestion(args));
  const startTest = useTestProgress((s) => s.startTest);
  const tickTestTimer = useTestProgress((s) => s.tickTestTimer);
  const mode = test.mode;
  const status = test.status;
  const testId = test.id;
  const questionBank = test.questionBank;
  const templateId = question.templateId;
  const reviewUrl = `/${questionBank}/tests/${testId}`;

  useEffect(() => {
    if (status === "created") startTest({ testId });
    if (status === "finished") router.replace(reviewUrl);
  });

  useEffect(() => {
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpentInMs = currentTime - lastTime;
      lastTime = currentTime;
      tickTestTimer({ testId, timeSpentInMs });
    }, 500);
    return () => clearInterval(interval);
  }, [testId, tickTestTimer]);

  useEffect(() => {
    if (mode !== "study") return;
    const url = new URL(window.location.href);
    url.searchParams.set("templateId", templateId);
    url.searchParams.set("questionBank", questionBank);
    router.replace(url.toString());
  }, [questionBank, templateId, router, mode]);
};
