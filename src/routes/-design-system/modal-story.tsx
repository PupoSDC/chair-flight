import { useState } from "react";
import { Button } from "../../libs/ui/components/base/button";
import { Modal } from "../../libs/ui/components/base/modal";
import type { FC } from "react";

export const ModalStory: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      {open && (
        <Modal
          title="Modal"
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
          onClose={() => setOpen(false)}
        >
          <p className="m-0 text-sm">
            Closed with Escape, a click outside, or its button.
          </p>
        </Modal>
      )}
    </div>
  );
};
