import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";

type Frame = { text: string; delay: number | null };

const getKeystrokeDelay = () => 60 + 60 * (Math.random() - 0.5);

const buildFrames = (steps: (string | number)[]): Frame[] =>
  steps.flatMap((step, index) => {
    if (typeof step === "number") {
      const previous = steps[index - 1] as string;
      return Array.from({ length: previous.length }, (_, i) => ({
        text: previous.slice(0, previous.length - i - 1),
        delay: null,
      }));
    }
    const next = steps[index + 1];
    return Array.from({ length: step.length }, (_, i) => ({
      text: step.slice(0, i + 1),
      delay: i === step.length - 1 && typeof next === "number" ? next : null,
    }));
  });

export const Typical: FC<{
  steps: (string | number)[];
  className?: string;
}> = ({ steps, className }) => {
  const frames = useMemo(() => buildFrames(steps), [steps]);
  const [frame, setFrame] = useState((steps[0] as string).length - 1);

  useEffect(() => {
    const timeout = setTimeout(
      () => setFrame((current) => (current + 1) % frames.length),
      frames[frame]?.delay ?? getKeystrokeDelay(),
    );
    return () => clearTimeout(timeout);
  }, [frame, frames]);

  return (
    <span className={className}>
      {frames[frame]?.text}
      <span aria-hidden="true" className="animate-blink font-normal">
        |
      </span>
    </span>
  );
};
