import { Duration } from "luxon";

const DURATION_UNITS: Record<string, "hours" | "minutes" | "seconds"> = {
  h: "hours",
  hr: "hours",
  hours: "hours",
  min: "minutes",
  minutes: "minutes",
  s: "seconds",
  sec: "seconds",
  seconds: "seconds",
};

export const formatAnswerValue = (
  value: number,
  answer: {
    unit: string;
    decimals: number;
    format?: string;
  },
) => {
  if (!answer.format) return String(Number(value.toFixed(answer.decimals)));
  const unit = DURATION_UNITS[answer.unit.toLowerCase()];
  if (!unit) throw new Error(`Unit "${answer.unit}" is not a duration unit`);
  return Duration.fromObject({ [unit]: Math.round(value) }).toFormat(
    answer.format,
  );
};
