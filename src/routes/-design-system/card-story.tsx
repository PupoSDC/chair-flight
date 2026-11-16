import { Card } from "../../libs/ui/components/base/card";
import type { FC } from "react";

export const CardStory: FC = () => (
  <Card className="max-w-md">
    <p className="m-0 text-sm font-semibold">A pending comment</p>
    <p className="m-0 mt-1 text-sm text-muted">
      I think option B is also correct after the 2024 amendment.
    </p>
  </Card>
);
