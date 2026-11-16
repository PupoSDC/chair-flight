import { useState } from "react";
import { Button } from "../../libs/ui/components/base/button";
import { Drawer } from "../../libs/ui/components/base/drawer";
import type { FC } from "react";

export const DrawerStory: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer title="Drawer" open={open} onClose={() => setOpen(false)}>
        <p className="m-0 p-4 text-sm">A panel sliding in from the right.</p>
      </Drawer>
    </div>
  );
};
