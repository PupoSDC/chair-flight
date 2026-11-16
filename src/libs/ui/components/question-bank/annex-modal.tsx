import { Modal } from "../base/modal";
import type { FC } from "react";

export const AnnexModal: FC<{
  href: string;
  onClose: () => void;
}> = ({ href, onClose }) => {
  return (
    <Modal title="Annex" bare onClose={onClose}>
      {href.endsWith(".pdf") ? (
        <iframe
          src={href}
          title="Annex"
          className="block h-dvh w-full max-w-4xl bg-white"
        />
      ) : (
        <img
          src={href}
          alt="Annex"
          className="block max-h-dvh max-w-full bg-white object-contain"
        />
      )}
    </Modal>
  );
};
