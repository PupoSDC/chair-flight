import { BuffetOnsetChart } from "../../libs/ui/components/question-bank/annex-buffet-onset-chart";
import type { FC } from "react";

export const AnnexBuffetOnsetChartStory: FC = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <BuffetOnsetChart className="border border-rule" />
    <BuffetOnsetChart
      className="border border-rule"
      fields={{ fl: "350", w: "127.5", n: "1.4" }}
    />
    <BuffetOnsetChart
      className="border border-rule"
      fields={{ fl: "380", w: "90", m: "0.8" }}
    />
  </div>
);
