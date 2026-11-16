import { A320Front } from "../../libs/ui/outlines/a320-front";
import { B737Front } from "../../libs/ui/outlines/b737-front";
import { CessnaProfile } from "../../libs/ui/outlines/cessna-profile";
import { PropellerFront } from "../../libs/ui/outlines/propeller-front";
import { TurbofanFront } from "../../libs/ui/outlines/turbofan-front";
import { WingPlan } from "../../libs/ui/outlines/wing-plan";
import { YokeFront } from "../../libs/ui/outlines/yoke-front";
import { StoryBlock } from "./story-block";
import type { FC } from "react";

export const OutlinesStory: FC = () => (
  <div className="flex flex-col gap-12">
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <StoryBlock title="Airbus A320-200">
        <A320Front className="w-full text-accent" />
      </StoryBlock>
      <StoryBlock title="Boeing 737-800">
        <B737Front className="w-full text-accent" />
      </StoryBlock>
      <StoryBlock title="Cessna 172">
        <CessnaProfile className="w-full text-accent" />
      </StoryBlock>
    </div>
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <StoryBlock title="Turbofan">
        <TurbofanFront className="w-full text-accent" />
      </StoryBlock>
      <StoryBlock title="Propeller">
        <PropellerFront className="w-full text-accent" />
      </StoryBlock>
      <StoryBlock title="Wing">
        <WingPlan className="w-full text-accent" />
      </StoryBlock>
      <StoryBlock title="Yoke">
        <YokeFront className="w-full text-accent" />
      </StoryBlock>
    </div>
  </div>
);
