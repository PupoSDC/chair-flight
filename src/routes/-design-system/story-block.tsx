import type { LinkProps } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";

export const STORY_LINK: LinkProps = { to: "/design-system/{-$story}" };

export const StoryBlock: FC<{
  title: string;
  note?: string;
  children: ReactNode;
}> = ({ title, note, children }) => (
  <section className="flex flex-col gap-3">
    <div>
      <h2 className="m-0 font-mono text-[13px] font-semibold text-accent">
        {title}
      </h2>
      {note && <p className="m-0 mt-0.5 text-xs text-muted">{note}</p>}
    </div>
    {children}
  </section>
);
