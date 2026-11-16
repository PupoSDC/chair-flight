import { useState } from "react";
import { Button } from "../../libs/ui/components/base/button";
import { AnnexModal } from "../../libs/ui/components/question-bank/annex-modal";
import type { FC } from "react";

export const AnnexModalStory: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open annex</Button>
      {open && (
        <AnnexModal
          href="/images/modules/atpl.png"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
