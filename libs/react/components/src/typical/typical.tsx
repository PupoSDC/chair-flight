import { useEffect, useMemo, useRef, useState } from "react";
import { Typography, styled } from "@mui/joy";
import type { TypographyProps } from "@mui/joy";
import type { FunctionComponent } from "react";

async function wait(time: number) {
  await new Promise<void>((r) => setTimeout(r, time));
}

async function* automaticType(
  steps: (string | number)[]
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

const StyledTypicalTypography = styled(Typography)`
  &::after {
    content: "|";
    animation: blink 1s infinite step-start;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

export type TypicalProps = {
  steps: (string | number)[];
} & Omit<TypographyProps, "children">;

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
    <StyledTypicalTypography ref={ref} {...props}>
      {text}
    </StyledTypicalTypography>
  );
};
