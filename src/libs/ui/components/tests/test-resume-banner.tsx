import { cn } from "../../utils/cn";
import { ButtonLink } from "../base/button-link";
import type { FC } from "react";

export const TestResumeBanner: FC<{
  test: {
    id: string;
    title: string;
    status: "created" | "started" | "finished";
  } | null;
}> = ({ test }) => {
  if (!test || test.status === "finished") return null;

  return (
    <div
      role="status"
      className={cn(
        "flex flex-none flex-col gap-2 rounded-lg border border-warning",
        "bg-paper p-3 sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <p className="m-0 text-sm">
        <span className="font-semibold capitalize">{test.title}</span> is still
        in progress. Creating a new test will erase it.
      </p>
      <ButtonLink
        to="/test/$testId"
        params={{ testId: test.id }}
        className="self-start sm:self-auto"
      >
        Resume test
      </ButtonLink>
    </div>
  );
};
