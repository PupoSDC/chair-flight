import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAnalytics } from "@chair-flight/react/analytics";

export const usePageTransition = () => {
  const hasMounted = useRef(false);
  const router = useRouter();
  const analytics = useAnalytics();
  const oldRoute = useRef<string>(router.asPath);
  const [isTransitioning, setIsTransitioning] = useState(false);
  oldRoute.current = router.asPath;

  useEffect(() => {
    if (!hasMounted.current) analytics.page();
    hasMounted.current = true;
  });

  useEffect(() => {
    router.events.on("routeChangeComplete", analytics.page);
    return () => {
      router.events.off("routeChangeComplete", analytics.page);
    };
  }, [analytics.page, router.events]);

  useEffect(() => {
    const onStart = (e: string) => {
      if (e.split("?")[0] === oldRoute.current.split("?")[0]) return;
      setIsTransitioning(true);
    };

    const onEnd = () => {
      setIsTransitioning(false);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onEnd);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onEnd);
    };
  }, [router.events]);

  return { isTransitioning };
};
