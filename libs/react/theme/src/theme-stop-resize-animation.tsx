"use client";

import { useEffect } from "react";
import { GlobalStyles } from "@mui/joy";
import type { FunctionComponent } from "react";

const RESIZE_CLASS_NAME = "resize-animation-stopper";
let resizeTimer: ReturnType<typeof setTimeout>;

export const ThemeStopResizeAnimation: FunctionComponent = () => {
  useEffect(() => {
    const listener = () => {
      document.body.classList.add(RESIZE_CLASS_NAME);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove(RESIZE_CLASS_NAME);
      }, 250);
    };

    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return (
    <GlobalStyles
      styles={{
        [`.${RESIZE_CLASS_NAME} *`]: {
          animation: "none !important",
          transition: "none !important",
        },
      }}
    />
  );
};
