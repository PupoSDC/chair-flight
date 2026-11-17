import { useRef } from "react";
import { ExternalLinkIcon } from "../../icons/external-link-icon";
import { ButtonIcon } from "../base/button-icon";
import { Modal } from "../base/modal";
import { BuffetOnsetChart } from "./annex-buffet-onset-chart";
import { MrjtLoadTrimSheet } from "./annex-mrjt-load-trim-sheet";
import type { FC } from "react";

export const AnnexModal: FC<{
  href: string;
  onClose: () => void;
}> = ({ href, onClose }) => {
  const [file, query] = href.split("?");
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollable =
    file.endsWith(".svg") ||
    file.endsWith("/010-aircraft-marshalling-signals.webp");

  const openInNewWindow = () => {
    const sheet = bodyRef.current?.querySelector("svg");
    if (!sheet) {
      window.open(href, "_blank");
      return;
    }
    const markup = new XMLSerializer().serializeToString(sheet);
    const blob = new Blob([markup], { type: "image/svg+xml" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  return (
    <Modal title="Annex" bare onClose={onClose}>
      <div ref={bodyRef}>
        <ButtonIcon
          label="Open in new window"
          onClick={openInNewWindow}
          icon={ExternalLinkIcon}
          className="absolute top-2 right-12 z-10"
        />
        {file.endsWith("031-mrjt-load-trim-sheet.svg") ? (
          <MrjtLoadTrimSheet
            fields={Object.fromEntries(new URLSearchParams(query))}
            className="w-[min(calc(100vw-1rem),calc((100dvh-1rem)*1.41))]!"
          />
        ) : file.endsWith("buffet-onset-boundary-chart.svg") ? (
          <BuffetOnsetChart
            fields={Object.fromEntries(new URLSearchParams(query))}
            className="w-[min(calc(100vw-1rem),calc((100dvh-1rem)*0.83))]!"
          />
        ) : scrollable ? (
          <div className="max-h-[calc(100dvh-1rem)] overflow-auto">
            <img
              src={href}
              alt="Annex"
              className="block w-[min(64rem,calc(100vw-1rem))] bg-white"
            />
          </div>
        ) : (
          <img
            src={href}
            alt="Annex"
            className="block max-h-dvh max-w-full bg-white object-contain"
          />
        )}
      </div>
    </Modal>
  );
};
