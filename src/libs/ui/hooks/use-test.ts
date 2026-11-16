import { useMemo, useSyncExternalStore } from "react";
import type { Test } from "../../core/tests/test";

const STORAGE_KEY = "chair-flight-test";
const LISTENERS = new Set<() => void>();

const readStoredTest = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

const writeStoredTest = (test: Test | null) => {
  try {
    if (test) localStorage.setItem(STORAGE_KEY, JSON.stringify(test));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  for (const listener of LISTENERS) listener();
};

const subscribeToStoredTest = (listener: () => void) => {
  LISTENERS.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    LISTENERS.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

export const useTest = () => {
  const storedTest = useSyncExternalStore(
    subscribeToStoredTest,
    readStoredTest,
    () => "",
  );
  const test = useMemo(
    () => (storedTest ? (JSON.parse(storedTest) as Test) : null),
    [storedTest],
  );

  return {
    test,
    saveTest: (nextTest: Test) => writeStoredTest(nextTest),
    clearTest: () => writeStoredTest(null),
  };
};
