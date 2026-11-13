import { useMemo, useSyncExternalStore } from "react";
import type { Test } from "../../core/tests/test";

const STORAGE_KEY = "chair-flight-tests";
const MAX_STORED_TESTS = 20;
const LISTENERS = new Set<() => void>();

const readStoredTests = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "{}";
  } catch {
    return "{}";
  }
};

const writeStoredTests = (tests: Record<string, Test>) => {
  const newestTests = Object.values(tests)
    .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
    .slice(0, MAX_STORED_TESTS);
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        Object.fromEntries(newestTests.map((test) => [test.id, test])),
      ),
    );
  } catch {}
  for (const listener of LISTENERS) listener();
};

const subscribeToStoredTests = (listener: () => void) => {
  LISTENERS.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    LISTENERS.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

export const useTests = () => {
  const storedTests = useSyncExternalStore(
    subscribeToStoredTests,
    readStoredTests,
    () => "{}",
  );
  const tests = useMemo(
    () => JSON.parse(storedTests) as Record<string, Test>,
    [storedTests],
  );

  const saveTest = (test: Test) =>
    writeStoredTests({ ...JSON.parse(readStoredTests()), [test.id]: test });

  const deleteTest = (testId: string) => {
    const { [testId]: _, ...otherTests } = JSON.parse(
      readStoredTests(),
    ) as Record<string, Test>;
    writeStoredTests(otherTests);
  };

  return { tests, saveTest, deleteTest };
};
