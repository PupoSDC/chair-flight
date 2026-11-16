import { Select } from "../../libs/ui/components/base/select";
import type { FC } from "react";

const OPTIONS = [
  { value: "a320", label: "Airbus A320" },
  { value: "b737", label: "Boeing 737" },
];

export const SelectStory: FC = () => (
  <div className="grid max-w-md gap-4">
    <Select
      label="Module"
      placeholder="Choose a module"
      defaultValue=""
      options={OPTIONS}
    />
    <Select
      label="Selected"
      placeholder="Choose"
      defaultValue="b737"
      options={OPTIONS}
    />
    <Select
      label="Required"
      required
      placeholder="Choose a module"
      defaultValue=""
      options={OPTIONS}
    />
    <Select
      label="Disabled"
      disabled
      placeholder="Choose"
      defaultValue="a320"
      options={OPTIONS}
    />
  </div>
);
