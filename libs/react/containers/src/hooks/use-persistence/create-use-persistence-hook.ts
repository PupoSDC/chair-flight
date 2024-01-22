import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { QuestionBankName } from "@chair-flight/base/types";

type PersistenceHook<T> = {
  data: T | undefined;
  setData: (data: T) => void;
  getData: () => T | undefined;
};

export type PersistenceKey =
  | `cf-annex-search-${QuestionBankName}`
  | `cf-question-search-${QuestionBankName}`
  | `cf-test-search-${QuestionBankName}`
  | `cf-learning-objectives-search-${QuestionBankName}`
  | `cf-test-maker-${QuestionBankName}`
  | `cf-test-progress`;

export const createUsePersistenceHook = <T>(
  name: PersistenceKey,
  initialValue: T,
  version?: number,
) => {
  const useZustand = create<PersistenceHook<T>>()(
    devtools(
      persist(
        (set, get) => ({
          version,
          data: initialValue,
          setData: (data: T) => set({ data }),
          getData: () => ({ ...initialValue, ...get().data }),
        }),
        { name, version },
      ),
    ),
  );

  return () => ({
    getData: useZustand((state) => state.getData),
    setData: useZustand((state) => state.setData),
  });
};
