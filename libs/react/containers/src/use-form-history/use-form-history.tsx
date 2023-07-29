import { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

interface FormPersistence<T> {
  history: Record<string, T[] | undefined>;
  addEntry: (id: string, value: T) => void;
  popEntry: (id: string) => void;
  clearHistory: (id: string) => void;
}

const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

const useFormHistoryZustand = create<FormPersistence<object>>()(
  devtools(
    persist(
      subscribeWithSelector((set) => ({
        history: {},
        addEntry: (id, v) =>
          set((state) => {
            const oldValues = state.history[id] ?? [];
            const newValues = [...oldValues, deepCopy(v)].slice(-200);
            return {
              ...state,
              history: {
                ...state.history,
                [id]: newValues,
              },
            };
          }),
        popEntry: (id) =>
          set((state) => {
            const values = state.history[id] ?? [];
            const newValues = values.slice(0, -1);
            return {
              ...state,
              history: {
                ...state.history,
                [id]: newValues,
              },
            };
          }),
        clearHistory: (id) =>
          set((state) => {
            return {
              ...state,
              history: {
                ...state.history,
                [id]: [],
              },
            };
          }),
      })),
      {
        name: "form-history",
      },
    ),
  ),
);

export const useFormHistory = (id: string) => {
  const { reset, getValues } = useFormContext<object>();
  const history = useFormHistoryZustand((s) => s.history);
  const popEntry = useFormHistoryZustand((s) => s.popEntry);
  const addEntry = useFormHistoryZustand((s) => s.addEntry);
  const clearHistory = useFormHistoryZustand((s) => s.clearHistory);
  const historyLength = history[id]?.length ?? 0;

  const undo = useCallback(() => {
    const newState = useFormHistoryZustand.getState().history[id]?.at(-2);
    if (newState) {
      console.log("resetting form", newState);
      reset(newState);
      popEntry(id);
    }
  }, [id, reset, popEntry]);

  const save = useCallback(() => {
    addEntry(id, getValues());
  }, [id, getValues, addEntry]);

  const clear = useCallback(() => {
    clearHistory(id);
  }, [id, clearHistory]);

  return {
    hasHistory: historyLength > 0,
    isUndoAvailable: historyLength > 1,
    save,
    undo,
    clear,
  };
};

export const RestoreFormHistory = ({ id }: { id: string }) => {
  const { save, hasHistory } = useFormHistory(id);
  useEffect(() => {
    if (hasHistory) {
      // offer to restore history
    } else {
      save();
    }
  }, []);
  return null;
};
