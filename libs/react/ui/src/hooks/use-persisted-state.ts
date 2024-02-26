import { useCallback, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ZodSchema, ZodTypeDef } from "zod";

type PersistenceData = {
  data: Record<string, unknown>;
  setData: (key: string, value: unknown) => void;
};

const usePersistedValueStore = create<PersistenceData>()(
  persist(
    (set, get) => ({
      data: {},
      setData: (key, value) => set({ data: { ...get().data, [key]: value } }),
    }),
    { name: "cf-persisted-value" },
  ),
);

export const usePersistedState = <T, I>(
  key: string,
  schema: ZodSchema<T, ZodTypeDef, I>,
  initialValue: T,
): [state: T, setState: (t: T) => void] => {
  const rawData = usePersistedValueStore((state) => state.data[key]);
  const setData = usePersistedValueStore((state) => state.setData);
  const setState = useCallback((data: T) => setData(key, data), [setData, key]);
  const pResult = useMemo(() => schema.safeParse(rawData), [schema, rawData]);
  const state = pResult.success ? pResult.data : initialValue;
  return [state, setState] as const;
};

// export const getPersistedState = usePersistedValueStore.getState;
