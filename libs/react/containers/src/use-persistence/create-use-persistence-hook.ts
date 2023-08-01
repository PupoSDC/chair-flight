import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type PersistenceHook<T> = {
  data: T | undefined;
  setData: (data: T) => void;
  getData: () => T | undefined;
};

export const createUsePersistenceHook = <T>(key: string, initialValue?: T) => {
  const useZustand = create<PersistenceHook<T>>()(
    devtools(
      persist(
        (set, get) => ({
          data: initialValue,
          setData: (data: T) => set({ data }),
          getData: () => get().data,
        }),
        { name: key },
      ),
    ),
  );

  return () => ({
    persistedData: useZustand((state) => state.data),
    getPersistedData: useZustand((state) => state.getData),
    setPersistedData: useZustand((state) => state.setData),
  });
};
