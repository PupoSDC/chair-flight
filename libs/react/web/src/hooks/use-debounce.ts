import { useState, useEffect } from "react";

/**
 * Inspired by https://usehooks-ts.com/react-hook/use-debounce
 */
export function useDebounce<T>(value: T, delay?: number): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  const isDebouncing = debouncedValue !== value;
  return [debouncedValue, isDebouncing];
}
