import { SearchTable } from "../../libs/ui/components/base/search-table";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const ROWS = [
  {
    id: "050.01.01",
    text: "Describe the vertical division of the atmosphere.",
  },
  {
    id: "050.01.02",
    text: "Explain the temperature lapse rate in the troposphere.",
  },
  { id: "050.02.01", text: "Define wind and state the units of wind speed." },
];

export const SearchTableStory: FC = () => (
  <div
    className={cn(
      "flex h-[360px] flex-col overflow-hidden rounded-lg border",
      "border-rule",
    )}
  >
    <SearchTable
      items={ROWS}
      hasMore={false}
      loading={false}
      emptyMessage="No learning objectives found"
      query=""
      correctedQuery={null}
      onLoadMore={() => {}}
      columns={[
        { header: "ID", className: "w-28", render: (row) => row.id },
        { header: "Text", render: (row) => row.text },
      ]}
      renderCard={(row) => (
        <div className="flex flex-col gap-1 p-3 text-sm">
          <strong>{row.id}</strong>
          {row.text}
        </div>
      )}
    />
  </div>
);
