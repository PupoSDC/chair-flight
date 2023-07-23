import { useEffect } from "react";
import dedent from "ts-dedent";
import { useUserVoyageFlag } from "@chair-flight/core/redux";
import { toast } from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

export const AlphaWarning: FunctionComponent = () => {
  const [, setHasSeenAlphaFlag, getHasSeenAlphaFlag] = useUserVoyageFlag(
    "has-seen-alpha-warning",
  );

  useEffect(() => {
    setTimeout(() => {
      if (getHasSeenAlphaFlag()) return;
      setHasSeenAlphaFlag(true);
      toast.warn(
        dedent`
          Chair Flight is still in alpha.
          All data created by you is stored in your browser only and will be periodically deleted.
        `,
        {
          duration: 10000,
        },
      );
    }, 3000);
  }, [getHasSeenAlphaFlag, setHasSeenAlphaFlag]);

  return null;
};
