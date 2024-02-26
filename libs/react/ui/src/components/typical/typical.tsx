"use client";

import { wait } from "@cf/base/utils";
import { cntl } from "@cf/base/utils";
import { twMerge } from 'tailwind-merge'
import { useEffect, useMemo, useRef, useState } from "react";
import type { FunctionComponent, HTMLAttributes } from "react";

async function* automaticType(
  steps: (string | number)[],
): AsyncGenerator<string> {
  let i = 1;
  let lastStep = steps[0] as string;
  while (true) {
    const step = steps[i % steps.length];
    if (typeof step === "number") {
      await wait(step);
      for (let j = 1; j < lastStep.length + 1; j++) {
        yield lastStep.slice(0, lastStep.length - j);
        await wait(60 + 60 * (Math.random() - 0.5));
      }
    } else {
      lastStep = step;
      for (let j = 0; j < step.length; j++) {
        yield step.slice(0, j + 1);
        await wait(60 + 60 * (Math.random() - 0.5));
      }
    }
    i++;
  }
}

export type TypicalProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  steps: (string | number)[];
};

export const Typical: FunctionComponent<TypicalProps> = ({
  steps,
  ...props
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(steps[0]);
  const generator = useMemo(() => automaticType(steps), [steps]);

  useEffect(() => {
    (async () => {
      const value = await generator.next();
      ref.current && setText(value.value);
    })();
  });

  return (
    <span
      {...props}
      ref={ref}
      children={text}
      className={twMerge(cntl`
        after:content-['|']
        after:animate-blink
      `, props.className)}
    />
  );
};
