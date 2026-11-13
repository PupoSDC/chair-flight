import type { FC } from "react";

export const IdLinks: FC<{
  ids: string[];
  renderId: (id: string) => React.ReactNode;
}> = ({ ids, renderId }) => (
  <div className="flex flex-col gap-0.5">
    {ids.slice(0, 5).map((id) => (
      <span key={id}>{renderId(id)}</span>
    ))}
    {ids.length > 5 && (
      <span className="text-[11px] text-muted">{`+ ${ids.length - 5} more`}</span>
    )}
  </div>
);
