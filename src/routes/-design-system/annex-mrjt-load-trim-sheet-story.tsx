import { MrjtLoadTrimSheet } from "../../libs/ui/components/question-bank/annex-mrjt-load-trim-sheet";
import type { FC } from "react";

export const AnnexMrjtLoadTrimSheetStory: FC = () => (
  <div className="flex flex-col gap-6">
    <MrjtLoadTrimSheet fields={{}} className="border border-rule" />
    <MrjtLoadTrimSheet
      className="border border-rule"
      fields={{
        dryOperatingMass: "34900",
        takeOffFuel: "9500",
        operatingMass: "44400",
        operatingMassA: "44400",
        maxZeroFuelMass: "51300",
        maxTakeOffMass: "62800",
        maxLandingMass: "52900",
        tripFuel: "6500",
        allowedTakeOffMassA: "60800",
        allowedTakeOffMassC: "59400",
        allowedTrafficLoad: "15000",
        allowedTrafficLoadA: "15000",
        totalTrafficLoad: "11230",
        totalTrafficLoadA: "11230",
        underload: "3770",
        underloadA: "3770",
        paxMale: "60",
        paxFemale: "30",
        baggageTotal: "1170",
        holdTotal: "3670",
        distribution0: "7560",
        solved:
          "operatingMass,operatingMassA,allowedTakeOffMassA,allowedTakeOffMassC,allowedTrafficLoad,allowedTrafficLoadA,passengerMass,totalTrafficLoad,totalTrafficLoadA,underload,underloadA,holdTotal,distribution0",
      }}
    />
  </div>
);
