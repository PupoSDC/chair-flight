import { useState } from "react";
import { Button } from "../../libs/ui/components/base/button";
import { AnnexModal } from "../../libs/ui/components/question-bank/annex-modal";
import type { FC } from "react";

export const AnnexModalStory: FC = () => {
  const [href, setHref] = useState<string>();

  return (
    <div className="flex gap-2">
      <Button onClick={() => setHref("/images/modules/atpl.png")}>
        Open annex
      </Button>
      <Button
        onClick={() =>
          setHref(
            "/content/annexes/atpl/031-mrjt-load-trim-sheet.svg?dryOperatingMass=34900&takeOffFuel=9500&tripFuel=6500&solved=underload&underload=3770",
          )
        }
      >
        Open load and trim sheet
      </Button>
      <Button
        onClick={() =>
          setHref(
            "/content/annexes/atpl/buffet-onset-boundary-chart.svg?fl=380&w=90&m=0.8",
          )
        }
      >
        Open buffet onset chart
      </Button>
      {href && <AnnexModal href={href} onClose={() => setHref(undefined)} />}
    </div>
  );
};
