import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const oldRoute = useRef<string>(router.asPath);
  oldRoute.current = router.asPath;

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
