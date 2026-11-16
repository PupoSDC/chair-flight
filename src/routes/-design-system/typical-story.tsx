import { Typical } from "../../libs/ui/components/public/typical";
import type { FC } from "react";

const STEPS = ["Airbus A320", 2000, "Boeing 737", 2000, "ATPL theory", 2000];

export const TypicalStory: FC = () => (
  <p className="m-0 text-2xl font-bold">
    Study for <Typical steps={STEPS} className="text-accent" />
  </p>
);
