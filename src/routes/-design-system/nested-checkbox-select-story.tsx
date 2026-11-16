import { useState } from "react";
import { NestedCheckboxSelect } from "../../libs/ui/components/base/nested-checkbox-select";
import type { FC } from "react";

const ITEMS = [
  {
    id: "050.01",
    label: "The atmosphere",
    subLabel: "210 questions",
    children: [
      { id: "050.01.01", label: "Composition", subLabel: "60 questions" },
      { id: "050.01.02", label: "Air temperature", subLabel: "150 questions" },
    ],
  },
  {
    id: "050.02",
    label: "Wind",
    subLabel: "180 questions",
    children: [
      { id: "050.02.01", label: "Definition", subLabel: "180 questions" },
    ],
  },
];

export const NestedCheckboxSelectStory: FC = () => {
  const [values, setValues] = useState(["050.01", "050.01.01", "050.01.02"]);

  return (
    <div className="flex max-w-md flex-col gap-3">
      <NestedCheckboxSelect
        items={ITEMS}
        values={values}
        onChange={setValues}
      />
      <p className="m-0 text-xs text-muted">Selected: {values.join(", ")}</p>
    </div>
  );
};
