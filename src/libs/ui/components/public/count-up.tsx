import { useEffect, useState } from "react";
import type { FC } from "react";

const easeInOutQuad = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;

export const CountUp: FC<{
  end: number;
  duration: number;
  className?: string;
}> = ({ end, duration, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const frame = { id: 0 };
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(easeInOutQuad(progress) * end));
      if (progress < 1) frame.id = requestAnimationFrame(tick);
    };
    frame.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.id);
  }, [end, duration]);

  return <span className={className}>{count}</span>;
};
