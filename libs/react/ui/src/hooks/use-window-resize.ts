"use client";

import { useLayoutEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = () => {
  const debounce = 100;
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleSize = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounce);
    };
    handleSize();
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  return windowSize;
};
