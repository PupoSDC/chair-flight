import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { LinearProgress } from "@mui/joy";

export const AppTransition = () => {
  const router = useRouter();
  const startTime = useRef<number>(0);
  const oldRoute = useRef<string>(router.asPath);
  const [visible, setVisible] = useState(false);
  oldRoute.current = router.asPath;

  useEffect(() => {
    const onStart = (e: string) => {
      if (e.split("?")[0] === oldRoute.current.split("?")[0]) return;
      setVisible(true);
      startTime.current = performance.now();
    };
    const onEnd = () => {
      const currenTime = performance.now();
      const tickTime = (currenTime - startTime.current + 1275) % 2500;
      const nextEndTime = 2500 - tickTime;
      setTimeout(() => setVisible(false), nextEndTime);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onEnd);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onEnd);
    };
  }, [router.events]);

  return visible ? (
    <LinearProgress
      sx={{
        "--LinearProgress-radius": 0,
        position: "fixed",
        bottom: 0,
        left: "-5%",
        width: "110%",
        zIndex: 1000,
      }}
    />
  ) : null;
};
