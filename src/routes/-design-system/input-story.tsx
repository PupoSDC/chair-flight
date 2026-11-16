import { Input } from "../../libs/ui/components/base/input";
import type { FC } from "react";

export const InputStory: FC = () => (
  <div className="grid max-w-md gap-4">
    <Input label="Name" placeholder="Jane Doe" />
    <Input label="Email" required placeholder="jane@example.com" />
    <Input label="With error" defaultValue="oops" error="Not valid" />
    <Input label="Invalid" defaultValue="oops" invalid />
    <Input label="Disabled" disabled defaultValue="Locked" />
  </div>
);
