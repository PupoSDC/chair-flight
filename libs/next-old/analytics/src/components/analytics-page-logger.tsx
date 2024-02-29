import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { analyticsContext } from "./analytics-provider";
import type { FunctionComponent } from "react";

export const AnalyticsPageLogger: FunctionComponent = () => {
  const analytics = useContext(analyticsContext);
  const oldRoute = useRef<string>("");
  const router = useRouter();

  useEffect(() => {
    const pathWithoutQuery = router.asPath.split("?")[0];
    if (oldRoute.current === pathWithoutQuery) return;
    oldRoute.current = pathWithoutQuery;
    analytics.then((a) => a.page());
  });

  return null;
};
