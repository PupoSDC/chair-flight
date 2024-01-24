import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { QuestionBankName } from "@chair-flight/base/types";

type PersistenceHook<T> = {
  data: T;
  setData: (data: T) => void;
  getData: () => T;
};

export type PersistenceKey =
  | `cf-annex-search-${QuestionBankName}`
  | `cf-question-search-${QuestionBankName}`
  | `cf-test-search-${QuestionBankName}`
  | `cf-learning-objectives-search-${QuestionBankName}`
  | `cf-test-maker-${QuestionBankName}`
  | `cf-test-progress`
  | `cf-user-preferences`
  | `cf-user-voyage`;

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
          setData: (data: T) =>
            set({
              data: {
                ...initialValue,
                ...get().data,
                ...data,
              },
            }),
          getData: () => ({
            ...initialValue,
            ...get().data,
          }),
        }),
        { name, version },
      ),
    ),
  );

  const usePersistenceHook = () => ({
    data: useZustand((state) => ({ ...initialValue, ...state.data })),
    getData: useZustand((state) => state.getData),
    setData: useZustand((state) => state.setData),
  });

  usePersistenceHook.state = useZustand;

  return usePersistenceHook;
};
