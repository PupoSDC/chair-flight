"use client";

import { useCallback, useEffect } from "react";
import { create } from "zustand";

type DebugCallback = () => Record<string, unknown>;
type DebugCallbacksMap = Record<string, DebugCallback | undefined>;

export const useBugReportStore = create<{
  isOpen: boolean;
  debugDataCallbacks: DebugCallbacksMap;
  setIsOpen: (isOpen: boolean) => void;
  setDebugCallback: (key: string, value?: DebugCallback) => void;
}>((set, get) => ({
  isOpen: false,
  debugDataCallbacks: {},
  setIsOpen: (isOpen) => set({ isOpen }),
  setDebugCallback: (key, value) => {
    const debugDataCallbacks = { ...get().debugDataCallbacks, [key]: value };
    return set({ debugDataCallbacks });
  },
}));

export const useBugReportDisclose = () => {
  const isOpen = useBugReportStore((b) => b.isOpen);
  const setIsOpen = useBugReportStore((b) => b.setIsOpen);
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  return { isOpen, open, close };
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
