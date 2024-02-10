import { useCallback, useEffect } from "react";
import { create } from "zustand";

type DebugCallback = () => Record<string, unknown>;
type DebugCallbacksMap = Record<string, DebugCallback | undefined>;

export const useBugReportStore = create<{
  isOpen: boolean;
  isAvailable: boolean;
  debugDataCallbacks: DebugCallbacksMap;
  setIsOpen: (isOpen: boolean) => void;
  setIsAvailable: (isAvailable: boolean) => void;
  setDebugCallback: (key: string, value?: DebugCallback) => void;
}>((set, get) => ({
  isOpen: false,
  isAvailable: false,
  debugDataCallbacks: {},
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsAvailable: (isAvailable) => set({ isAvailable }),
  setDebugCallback: (key, value) => {
    const debugDataCallbacks = { ...get().debugDataCallbacks, [key]: value };
    return set({ debugDataCallbacks });
  },
}));

export const useBugReportDisclose = () => {
  const setIsOpen = useBugReportStore((b) => b.setIsOpen);
  const isAvailable = useBugReportStore((b) => b.isAvailable);
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  return { isAvailable, open };
};

export const useBugReportDebugData = (
  key: string,
  callback: () => Record<string, unknown>,
) => {
  const setDebugCallback = useBugReportStore((b) => b.setDebugCallback);

  useEffect(() => {
    setDebugCallback(key, callback);
    return () => setDebugCallback(key, undefined);
  }, [key, callback, setDebugCallback]);
};
