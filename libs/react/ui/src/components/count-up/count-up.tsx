"use client";

import { useEffect, useState } from "react";
import { Typography } from "@mui/joy";
import type { TypographyProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type CountUpProps = {
  end: number;
  duration: number;
} & Omit<TypographyProps, "children">;

const waitMs = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const easeInOutQuad = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

/**
 * A span component that counts up from 0 to a given number.
 */
export const CountUp: FunctionComponent<CountUpProps> = ({
  end,
  duration,
  ...props
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const deltaT = 1000 / 30;
    (async () => {
      let time = 0;
      while (time <= duration && !cancelled) {
        await waitMs(deltaT);
        time += deltaT;
        const progress = easeInOutQuad(Math.min(time / duration, 1));
        setCount(Math.round(progress * end));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [end, duration]);

  return <Typography {...props} children={count} />;
};
