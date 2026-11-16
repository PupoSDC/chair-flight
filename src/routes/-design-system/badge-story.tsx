import { Badge } from "../../libs/ui/components/base/badge";
import type { FC } from "react";

export const BadgeStory: FC = () => (
  <div className="flex flex-wrap gap-2">
    <Badge>ATPL(A)</Badge>
    <Badge tone="success">Approved</Badge>
    <Badge tone="danger">Rejected</Badge>
    <Badge tone="neutral">Draft</Badge>
  </div>
);
