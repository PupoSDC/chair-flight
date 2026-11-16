import { useState } from "react";
import { Button } from "../../libs/ui/components/base/button";
import { AccountModal } from "../../libs/ui/components/community/account-modal";
import type { FC } from "react";

export const AccountModalStory: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open sign in</Button>
      {open && <AccountModal onClose={() => setOpen(false)} />}
    </div>
  );
};
