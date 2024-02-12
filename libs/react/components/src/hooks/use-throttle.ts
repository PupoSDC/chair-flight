import { useEffect, useRef, useState } from "react";

export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const nextUpdateT = lastUpdated.current + delay;
    const currentTime = Date.now();
    const delta = nextUpdateT - currentTime;

    if (delta < 0) {
      setThrottledValue(value);
      lastUpdated.current = Date.now();
      return;
    }

    const timeoutId = setTimeout(() => {
      setThrottledValue(value);
      lastUpdated.current = Date.now();
    }, delta);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return throttledValue;
};
