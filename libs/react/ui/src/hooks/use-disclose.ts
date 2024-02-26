"use client";

import { useCallback, useState } from "react";

export const useDisclose = (initialValue = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);
  return {
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    toggle: useCallback(() => setIsOpen((o) => !o), []),
  };
};
